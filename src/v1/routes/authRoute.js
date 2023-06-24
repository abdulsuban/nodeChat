'use strict';

const passport = require('passport');
const router = require('express-promise-router')();

// controllers
const authController = require('../controllers/authController');
// const { adminRouteGuard } = require('../../middlewares/checkRole');

// passport
require('../../helpers/passport');

const requireAuth = passport.authenticate('accessTokenAuth', { session: false });

// user
router.post('/signUp', authController.signUp);
router.post('/signIn', authController.SignIn);
router.get('/logout', requireAuth, authController.signOut);
router.post('/changePassword', requireAuth, authController.changePassword);
// router.post('/resetPassword', requireAuth, adminRouteGuard, authController.resetPassword);

module.exports = router;
