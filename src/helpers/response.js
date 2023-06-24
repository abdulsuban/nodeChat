'use strict';

const generalLogger = require('../config/winston');
const { StatusCode } = require('./constants');

module.exports = {

  respondSuccess: (res, message, statusCode, data) => {
    if (!data) {
      return res.status(statusCode).json({
        success: true,
        message: !message ? 'query was successfull' : message,
      });
    }
    generalLogger.log('info', `${message}`);
    return res.status(statusCode).json({
      success: true,
      message: !message ? 'query was successfull' : message,
      data,
    });
  },

  respondFailure: (res, message, statusCode = StatusCode.NOT_FOUND, data) => {
    generalLogger.log('info', `${message}`);
    if (!data) {
      return res.status(statusCode).json({
        success: false,
        message: !message ? 'something went wrong' : message,
      });
    }
    res.status(statusCode).json({
      success: false,
      message: !message ? 'something went wrong' : message,
      data,
    });
  },

  respondError: (message, statusCode = StatusCode.BAD_REQUEST) => {
    const error = new Error(`${message}`);
    error.status = statusCode;
    generalLogger.log('error', message);
    return error;
  },

  urlNotFound: (_res, _data) => {
    generalLogger.log('warn', 'url not found, please check the documentation');
    const error = new Error('url not found, please check the documentation');
    error.status = StatusCode.NOT_FOUND;
    return error;
  },

};
