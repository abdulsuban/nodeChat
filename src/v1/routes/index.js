'use strict';
const express = require('express');
const app = express();
const passport = require('passport');
const path = require('path');
const { I18n } = require('i18n');

// passport
require('../../helpers/passport');

// locales
const i18n = new I18n({
  locales: ['en', 'de'],
  directory: path.join(__dirname, '../../locales'),
});

app.use(i18n.init);

// common controller
const commonRoutes = require('./common');

// middleware requireAuth
const requireRefreshAuth = passport.authenticate('refreshTokenAuth', { session: false });
// const requireAuth = passport.authenticate('accessTokenAuth', { session: false });

// common routes
app.use('/refresh', requireRefreshAuth, commonRoutes);

// routes


const authRoute = require('./authRoute');

app.use('/auth', authRoute);


// default route
app.use('/', (_req, res, _next) => { res.send({ success: true, message: 'Gretings From Get-it-shopping.' }); });

module.exports = app;
