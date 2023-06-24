'use strict';

// core modules
const FCM = require('fcm-node');
const nodemailer = require('nodemailer');

module.exports = {
  sendMail: (options) => {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: process.env.NODEMAILER,
        pass: process.env.NODEMAILER_PASS,
      },
    });

    const mailOptions = {
      from: options.from,
      to: options.to,
      subject: options.subject,
      html: options.content,
    };
    return new Promise((resolve) => {
      transporter.sendMail(mailOptions, (err, _info) => {
        if (err) {
          console.log(err);
          resolve(false);
        } else {
          console.log('_info from Nodemailer', _info);
          resolve(true);
        }
      });
    });
  },

  sendPushNotification: async(options) => {
    const { token, body } = options;
    if (body && token) {
      const message = {
        to: token,
        priority: 'high',
        notification: {
          title: body.title,
          body: body.content,
          sound: 'default',
        },
        data: {
          title: 'Get-it-shopping',
          body: body,
          sound: 'default',
        },
        apns: {
          payload: {
            aps: {
              badge: body.badge,
            },
          },
        },
      };
      const fcmSender = new FCM(process.env.SERVERKEY);
      fcmSender.send(message, (err, response) => {
        if (err) {
          console.log('FCM ERROR : ', err);
          return err;
        }
        console.log('FCM Successfully sent with response: ', response);
        return response;
      });
    }
    return false;
  },
};
