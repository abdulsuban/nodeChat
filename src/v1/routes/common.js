'use strict';
const router = require('express-promise-router')();

// passport
require('../../helpers/passport');

// common controller
const commonController = require('../controllers/commonController');

// common routes
router.get('/token', commonController.tokenRefresh);

module.exports = router;
