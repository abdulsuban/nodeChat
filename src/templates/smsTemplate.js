'use strict';

const { smsContent } = require('../helpers/constants');

module.exports = {

  smsVerificationTemplate: (smsOptions) => {
    const { verificationCode, phoneNumber, language } = smsOptions;
    return {
      message: smsContent.smsVerification(verificationCode, language),
      phoneNumber,
    };
  },
};
