'use strict';

const Joi = require('joi');

module.exports = {
  validateSignUp: (input) => {
    const schema = Joi.object().keys({
      email: Joi.string().required(),
      userName: Joi.string().required(),
      password: Joi.string().min(8).required(),
      // gender: Joi.string().required().valid(['male', 'female']),
    });
    return Joi.validate(input, schema);
  },

  validateSignIn: (input) => {
    const schema = Joi.object().keys({
      password: Joi.string().min(8).required(),
      email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    });
    return Joi.validate(input, schema);
  },

  validateChangePassword: (input) => {
    const schema = Joi.object().keys({
      oldPassword: Joi.string().min(8).required(),
      newPassword: Joi.string().min(8).required(),
    });
    return Joi.validate(input, schema);
  },

  validateResetPassword: (input) => {
    const schema = Joi.object().keys({
      id: Joi.string().required(),
    });
    return Joi.validate(input, schema);
  },
};
