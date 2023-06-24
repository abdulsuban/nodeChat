'use strict';

const User = require('../../models/User');

const { sendMail } = require('../../helpers/notification');
const { passwordAttemptsEmail } = require('../../templates/emailTemplate');

const {
  respondSuccess,
  respondFailure,
  respondError,
} = require('../../helpers/response');
const { getMessageFromValidationError } = require('../../helpers/utils');
const {
  validateSignIn,
  validateChangePassword,
  validateSignUp,
} = require('../../v1/validators/authValidation');
const { getAuthTokens } = require('../../helpers/token');
const constValues = require('../../helpers/constants');
const localesKeys = require('../../locales/keys.json');

module.exports = {
  signUp: async(req, res, next) => {
    const { body, language } = req;
    const { email } = body;
    const { error } = validateSignUp(body);
    if (error) {
      return next(respondError(getMessageFromValidationError(error)));
    }
    const userUserExist = await User.findOne({
      email,
      userType: constValues.userType.USER,
    });
    if (userUserExist) {
      return respondFailure(
        res,
        req.__(localesKeys.auth.EMAIL_ALREADY_EXISTS),
        constValues.StatusCode.CONFLICT,
      );
    }
    const newuserUser = new User(body);
    newuserUser.email = email;
    newuserUser.userName = body.userName;
    newuserUser.status = constValues.status.Active;
    newuserUser.userType = constValues.userType.USER;
    // newuserUser.gender = body.gender;
    await newuserUser.save();

    return respondSuccess(
      res,
      req.__(localesKeys.auth.USER_REGISTERED_SUCCESSFULLY, language),
      constValues.StatusCode.OK,
    );
  },

  SignIn: async(req, res, next) => {
    const { body, language } = req;
    const { email, password } = body;
    const { error } = validateSignIn(body);
    if (error) {
      return next(respondError(getMessageFromValidationError(error)));
    }
    let dataTosend = {};

    const userData = await User.findOne({
      email,
      userType: constValues.userType.USER,
    });

    if (!userData) {
      return respondFailure(
        res,
        req.__(localesKeys.auth.USER_NOT_FOUND, language),
        constValues.StatusCode.NOT_FOUND,
      );
    }

    if (Number(userData.passwordAttempts) === 5) {
      return respondFailure(
        res,
        req.__(localesKeys.auth.USER_DEACTIVE, language),
        constValues.StatusCode.FORBIDDEN,
      );
    }

    userData.comparePassword(password, async(passwordError, isMatch) => {
      if (passwordError) {
        return respondFailure(
          res,
          req.__(localesKeys.global.TRY_AGAIN, language),
          constValues.StatusCode.INTERNAL_SERVER_ERROR,
        );
      }
      if (!userData.status) {
        return respondFailure(
          res,
          req.__(localesKeys.auth.USER_NOT_ACTIVE, language),
          constValues.StatusCode.CONFLICT,
        );
      }
      if (!isMatch) {

        if (Number(userData.passwordAttempts) === 2) {
          const emailOptions = {
            email: email.toLowerCase(),
            language: language,
          };
          // await sendMail(passwordAttemptsEmail(emailOptions));
        }

        await User.updateOne(
          { _id: userData.id },
          { $inc: { passwordAttempts: +1 } },
        );
        return respondFailure(
          res,
          req.__(localesKeys.auth.WRONG_PASSWORD, language),
          constValues.StatusCode.NOT_FOUND,
        );
      }
      const { accessToken, refreshToken } = getAuthTokens(userData.id);
      await User.updateOne(
        { _id: userData.id, passwordAttempts: 0 },
        {
          $set: { updatedAt: new Date() },
        },
      );

      dataTosend = {
        _id: userData._id,
        email: userData.email,
        userType: userData.userType,
      };

      return respondSuccess(
        res,
        req.__(localesKeys.auth.LOG_IN_SUCCESSFULLY, language),
        constValues.StatusCode.OK,
        {
          accessToken: accessToken,
          refreshToken: refreshToken,
          userData: dataTosend,
        },
      );
    });
  },

  signOut: async(req, res, _next) => {
    const { user, language } = req;
    const { id } = user;
    await User.updateOne({ _id: id }, { $set: { deviceToken: null } });
    return respondSuccess(
      res,
      req.__(
        localesKeys.auth.LOG_OUT_SUCCESSFULLY,
        language,
        constValues.StatusCode.OK,
      ),
    );
  },

  changePassword: async(req, res, next) => {
    const { user, language, body } = req;
    const { id } = user;
    const { oldPassword, newPassword } = body;
    const { error } = validateChangePassword(body);
    if (error) {
      return next(respondError(getMessageFromValidationError(error)));
    }

    const userData = await User.findOne({ _id: id });
    if (!userData) {
      return respondFailure(
        res,
        req.__(localesKeys.auth.USER_NOT_FOUND, language),
        constValues.StatusCode.NOT_FOUND,
      );
    }

    userData.comparePassword(oldPassword, async(passwordError, isMatch) => {
      if (passwordError) {
        return respondFailure(
          res,
          req.__(localesKeys.global.TRY_AGAIN, language),
          constValues.StatusCode.INTERNAL_SERVER_ERROR,
        );
      }
      if (!userData.status) {
        return respondFailure(
          res,
          req.__(localesKeys.auth.USER_NOT_ACTIVE, language),
          constValues.StatusCode.CONFLICT,
        );
      }
      if (!isMatch) {
        return respondFailure(
          res,
          req.__(localesKeys.auth.WRONG_PASSWORD, language),
          constValues.StatusCode.NOT_FOUND,
        );
      }

      userData.password = newPassword;
      if (!(await userData.save())) {
        return respondFailure(
          res,
          req.__(localesKeys.auth.USER_NOT_UPDATED, language),
          constValues.StatusCode.NOT_FOUND,
        );
      }
      return respondSuccess(
        res,
        req.__(localesKeys.auth.CHANGE_PASSWORD_SUCCESSFUL, language),
        constValues.StatusCode.CREATED,
      );
    });
  },
};
