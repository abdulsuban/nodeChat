'use strict';

const { emailSubject, emailContent } = require('../helpers/constants');

module.exports = {

  emailVerifcationTemplate: (emailOptions) => {
    const { email, verificationCode, language } = emailOptions;
    return {
      from: process.env.NODEMAILER,
      to: email,
      subject: emailSubject.emailVerification(language),
      content: emailContent.emailVerification(verificationCode, language),
    };
  },

  forgotPasswordEmail: (emailOptions) => {
    const { email, password, language } = emailOptions;
    return {
      from: process.env.NODEMAILER,
      to: email,
      subject: emailSubject.forgotPassword(language),
      content: emailContent.forgotPassword(password, language),
    };
  },

  passwordChangeEmail: (emailOptions) => {
    const { email, language } = emailOptions;
    return {
      from: process.env.NODEMAILER,
      to: email,
      subject: emailSubject.passwordChange(language),
      content: emailContent.passwordChange(language),
    };
  },

  passwordAttemptsEmail: (emailOptions) => {
    const { email, language } = emailOptions;
    return {
      from: process.env.NODEMAILER,
      to: email,
      subject: emailSubject.passwordAttemptsEmail(language),
      content: emailContent.passwordAttemptsEmail(language),
    };
  },

};
