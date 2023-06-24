'use strict';

const AWS = require('aws-sdk');

const moment = require('moment-timezone');
moment.tz.setDefault('Europe/Berlin');
moment.suppressDeprecationWarnings = true;
const crypto = require('crypto');

const { respondFailure } = require('./response');
const constValues = require('./constants');
const localesKeys = require('../locales/keys.json');

const s3bucket = new AWS.S3({
  signatureVersion: 'v4',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

module.exports = {

  generateVerificationCode: () => Math.floor(100000 + parseFloat(String('0.').concat(parseFloat(crypto.randomInt(0, 999999)))) * 900000),

  generatePassword: (len) => {
    const length = (len) || (8);
    const string = 'abcdefghijklmnopqrstuvwxyz';
    const numeric = '0123456789';
    const punctuation = '!@#$%^&*';
    let password = '';
    let character = '';
    while (password.length < length) {
      const entity1 = Math.ceil(string.length * parseFloat(String('0.').concat(parseFloat(crypto.randomInt(0, 999999)))) * parseFloat(String('0.').concat(parseFloat(crypto.randomInt(0, 999999)))));
      const entity2 = Math.ceil(numeric.length * parseFloat(String('0.').concat(parseFloat(crypto.randomInt(0, 999999)))) * parseFloat(String('0.').concat(parseFloat(crypto.randomInt(0, 999999)))));
      const entity3 = Math.ceil(punctuation.length * parseFloat(String('0.').concat(parseFloat(crypto.randomInt(0, 999999)))) * parseFloat(String('0.').concat(parseFloat(crypto.randomInt(0, 999999)))));
      let hold = string.charAt(entity1);
      hold = (password.length % 2 === 0) ? (hold.toUpperCase()) : (hold);
      character += hold;
      character += numeric.charAt(entity2);
      character += punctuation.charAt(entity3);
      password = character;
    }
    password = password.split('').sort(() => {
      return 0.5 - parseFloat(String('0.').concat(parseFloat(crypto.randomInt(0, 999999))));
    }).join('');
    return password.slice(0, len);
  },

  getMessageFromValidationError: (error) => {
    const message = error.details[0].message.replace(/\"/g, '');
    const path = error.details[0].path.join().replace(/0,/g, '').replace(/,/g, '.');
    return message + ', PATH: ' + path;
  },

  generateChatId: () => {
    let randSixDigit = Math.floor(100000 + parseFloat(String('0.').concat(parseFloat(crypto.randomInt(0, 999999)))) * 900000);
    let randStringDigit = parseFloat(String('0.').concat(parseFloat(crypto.randomInt(0, 999999)))).toString(36).substring(7).toUpperCase();
    return `CHID${randSixDigit}${randStringDigit}`;
  },

  // WORKS ON AWS S3
  uploadImage: async(file, bucketName, fileName, contentType) => {
    const s3Params = {
      Bucket: process.env.AWS_BUCKET,
      Key: `${bucketName}/${fileName}`,
      ContentType: contentType,
      Body: file.data,
      ACL: 'public-read',
    };
    return s3bucket
      .upload(s3Params)
      .promise()
      .then((data) => {
        console.log(data);
        return { status: true, data: data };
      })
      .catch((err) => {
        console.log(err);
        return { status: false, error: err.message };
      });
  },

  uploadFileCode: async(mainImage, bucketFolder) => {
    let imageName = '';
    const refExt = mainImage.name && mainImage.name.substring(mainImage.name.lastIndexOf('.') + 1, mainImage.name.length);
    const filename = `${new Date().getTime()}.${refExt}`;
    try {
      const uploadRes = await module.exports.uploadImage(mainImage, bucketFolder, filename, mainImage.mimetype);
      if (uploadRes.status) {
        imageName = `${bucketFolder}/${filename}`;
      }
    } catch (err) {
      imageName = '';
    }
    return imageName;
  },

  deleteFileFromS3: async(key) => {
    const bucket = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: 'eu-central-1',
    });
    const s3Params = {
      Bucket: process.env.AWS_BUCKET,
      Key: key,
    };
    return bucket.deleteObject(s3Params, (err, _data) => {
      if (err) {
        console.log(err);
      }
    });
  },

  uploadImageCommon: async(req, res, path) => {
    const { body, language } = req;
    if (req.files && req.files.image) {
      body.image = await module.exports.uploadFileCode(req.files.image, path);
      if (!body.image) {
        return respondFailure(res, req.__(localesKeys.upload.FAILED_TO_UPLOAD_FILE, language), constValues.StatusCode.INTERNAL_SERVER_ERROR);
      }
      return body.image;
    } else {
      return respondFailure(res, req.__(localesKeys.upload.PLEASE_UPLOAD_FILE, language), constValues.StatusCode.CONFLICT);
    }
  },

};
