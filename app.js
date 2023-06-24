'use strict';

require('dotenv').config();

// node modules
const http = require('http');

// npm modules
const chalk = require('chalk');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const express = require('express');
const fileUploader = require('express-fileupload');

// app modules
const winston = require('./src/config/winston');
const mongoose = require('./src/database/mongoose');
const { urlNotFound } = require('./src/helpers/response');
const { requireApiKey } = require('./src/middlewares/apiRequest');

// express instance
const app1 = express();

// cors options
let whitelist = ['http://localhost:7000'];
const corsOptions = {
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  exposedHeaders: 'Content-Type, X-Auth-Token',
  methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
  preflightContinue: false,
};

// Database setup
mongoose.connect();

app1.set('trust proxy', true);
// middlewares
app1.use(helmet());
app1.use(helmet.hidePoweredBy());
app1.use(morgan('combined', { stream: winston.stream }));
app1.use(fileUploader());

app1.disable('etag');
app1.use(cors(corsOptions));
app1.use(express.urlencoded({ extended: true }));
app1.use(express.json());
app1.use('/logs', express.static('logs'));
app1.use('/uploads', express.static('uploads'));

// routes
app1.use('/api/v1', requireApiKey, require('./src/v1/routes/index'));

// error handler
app1.use((_req, _res, next) => {
  return next(urlNotFound());
});

app1.use((err, _req, res, _next) => {
  const error = err;
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: error.message ? error.message : err,
  });
  console.log(chalk.red('Error:', err));
});

// server setup
const port = process.env.PORT || 7000;
const server = http.createServer(app1);
server.listen(port, (err) => {
  if (err) {
    console.log(chalk.red(`Error : ${err}`));
    process.exit(-1);
  }
  console.log(chalk.blue(`${process.env.APP} is running on ${port}`));
});

module.exports = server;
