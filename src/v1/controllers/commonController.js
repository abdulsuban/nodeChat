'use strict';
// helpers
const { respondSuccess } = require('../../helpers/response');
const { getAuthTokens } = require('../../helpers/token');
const constValues = require('../../helpers/constants');
const localesKeys = require('../../locales/keys.json');

module.exports = {
  tokenRefresh: async(req, res, _next) => {
    const { id, language } = req.user;
    const { accessToken } = getAuthTokens(id, true);
    return respondSuccess(res, req.__(localesKeys.global.REQUEST_WAS_SUCCESSFULL, language), constValues.StatusCode.OK, { token: accessToken });
  },
};
