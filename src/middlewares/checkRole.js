'use strict';

const { respondError } = require('../helpers/response');
const { userType, StatusCode } = require('../helpers/constants');

module.exports = {

  adminRouteGuard: (req, _res, next) => {
    const { user } = req;
    if (user.userType !== userType.ADMIN) {
      return next(respondError('forbidden', StatusCode.FORBIDDEN));
    }
    return next();
  },

};
