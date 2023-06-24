'use strict';

module.exports = {

  logger: {
    log: (message) => {
      console.log(message);
    },
  },

  status: {
    ACTIVE: true,
    DEACTIVE: false,
  },

  userType: {
    USER: 1,
    COMPANY: 2,
    ADMIN: 3,
  },

  companyStatus: {
    ACTIVE: 1,
    DEACTIVE: 2,
  },

  candidateStatus: {
    ACTIVE: 1,
    DEACTIVE: 2,
  },

  jobStatus: {
    ACTIVE: 1,
    DEACTIVE: 2,
  },

  loginType: {
    PHONENUMBER: 1,
    EMAIL: 2,
  },

  NotificationTitle: {

    promotionList: (language) => {
      if (language === 'en') {
        return 'New Offers';
      }
      return 'Neue Angebote';
    },

    inzoneNotification: (_language) => {
      return 'Inzone';
    },

  },

  NotificationType: {
    PROMOTIONLIST: 'PROMOTIONLIST',
    INZONENOTIFICATION: 'INZONENOTIFICATION',
    OFFZONENOTIFICATION: 'OFFZONENOTIFICATION',
  },

  NotificationContent: {

    promotionList: (count, language) => {
      if (language === 'en') {
        return `Lists of Offers Inside Zone ${count}`;
      }
      return `Listen der Angebote Inside Zone ${count}`;
    },

    newPromotionCreated: (name, language) => {
      if (language === 'en') {
        return `New Promotion created ${name}`;
      }
      return `Neue Promotion erstellt ${name}`;
    },

    inzoneNotification: (language) => {
      if (language === 'en') {
        return 'Now Your are in inzone';
      }
      return 'Sie sind jetzt in der Inzone';
    },

  },

  emailSubject: {

    emailVerification: (language) => {
      if (language === 'de') {
        return 'Bestätigung Code';
      }
      return 'Confirmation Code';
    },

    accountCreated: (language) => {
      if (language === 'de') {
        return 'Verwaltung Erstellt';
      }
      return 'Admin Created';
    },

    forgotPassword: (language) => {
      if (language === 'de') {
        return 'Neues Passwort';
      }
      return 'New Password';
    },

    passwordChange: (language) => {
      if (language === 'de') {
        return 'Passwortänderung';
      }
      return 'Password Change';
    },

    passwordAttemptsEmail: (language) => {
      if (language === 'de') {
        return 'Falsche Passwortversuche';
      }
      return 'Wrong Password Attempts';
    },

  },

  emailContent: {

    emailVerification: (verificationCode, language) => {
      if (language === 'de') {
        return `
          <p>Hier ist dein Bestätigungs-Code: <b>${verificationCode}</b></p>
          <br/>
          <p>Grüße,</p>
          <p><b>Dein GET iT OFFLINE - Team</b></p>
        `;
      }
      return `
          <p>Here is your Confirmation Code: <b>${verificationCode}</b></p>
          <br/>
          <p>Regards,</p>
          <p><b>Your GET iT OFFLINE - Team</b></p>
        `;
    },

    accountCreated: (email, password, _fullName, language) => {

      let link;
      if (process.env.NODE_ENV !== 'test'){
        link = process.env.DOMAIN;
      } else {
        link = process.env.IP;
      }

      if (language === 'de') {
        return `
        <div>
        <p>Sehr geehrte Damen und Herren,</p>
        <p>herzlich willkommen bei GET iT OFFLINE. Hiermit erhalten Sie folgende Zugangsdaten:</p>
        <p><b>email:</b> ${email}</p>
        <p><b>password:</b> ${password}</p>
        <p><b>Klicken Sie hier: </b><a href="${link}">Um das Dashboard zu sehen</a></p>
        <p>Vielen Dank,<br/>
        <p><b>Ihr GET iT OFFLINE - Team</b></p>
        </p>
      </div>
        `;
      }
      return `
      <div>
        <p>Dear Ladies and Gentlemen,</p>
        <p>Welcome to Get-it-shopping. Please find your login details below.</p>
        <p><b>email:</b> ${email}</p>
        <p><b>password:</b> ${password}</p>
        <p><b>Click here: </b><a href="${link}">To see dashboard</a></p>
        <p>Thank You,<br/>
        <p><b>Team Node Chat</b></p>
        </p>
      </div>
      `;
    },

    forgotPassword: (password, language) => {
      if (language === 'de') {
        return `
          <p>Hier kommt dein neues Passwort: <b>${password}</b>. Es ist nur 1 x zu nutzen.</p>
          <br/>
          <p>Grüße,</p>
          <p><b>Ihr GET iT OFFLINE - Team</b></p>
        `;
      }
      return `
          <p>Here is your new password: <b>${password}</b>. It can only be used once.</p>
          <br/>
          <p>Regards,</p>
          <p><b>Team Node Chat</b></p>
        `;
    },

    passwordChange: (language) => {
      if (language === 'de') {
        return '<p>Ihr Passwort wurde erfolgreich geändert.</p><br/><p>Grüße,</p><p><b>Ihr GET iT OFFLINE - Team</b></p>';
      }
      return '<p>Your password has been changed successfully.</p><br/><p>Regards,</p><p><b>Team Node Chat</b></p>';
    },

    passwordAttemptsEmail: (language) => {
      if (language === 'de') {
        return '<p>Nach zwei weiteren fehlgeschlagenen Passwortversuchen werden Sie gesperrt..</p><br/><p>Grüße,</p><p><b>Ihr GET iT OFFLINE - Team</b></p>';
      }
      return '<p>You will be blocked after two more unsuccessful password attempts.</p><br/><p>Regards,</p><p><b>Team Node Chat</b></p>';
    },

  },

  smsContent: {

    smsVerification: (verificationCode, language) => {
      if (language === 'de'){
        return `Ihr Verifizierungscode lautet: ${verificationCode}.`;
      }
      return `your verification otp is : ${verificationCode}.`;
    },

    forgotPassword: (password) => {
      return `your password is : ${password}.`;
    },

  },

  StatusCode: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
  },

};
