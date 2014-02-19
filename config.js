'use strict';

exports.port = process.env.PORT || 3000;
exports.mongodb = {
  uri: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'localhost/blister'
};
exports.companyName = 'Big Bear Lake';
exports.projectName = 'TripIn Big Bear';
exports.systemEmail = '<youraddy>@esri.com';
exports.cryptoKey = 'k3yb0ardc4tzzz';
exports.loginAttempts = {
  forIp: 50,
  forIpAndUser: 7,
  logExpiration: '20m'
};
exports.requireAccountVerification = true;
exports.smtp = {
  from: {
    name: process.env.SMTP_FROM_NAME || exports.projectName + ' Website',
    address: process.env.SMTP_FROM_ADDRESS || '<youraddy>@esri.com'
  },
  credentials: {
    user: process.env.SMTP_USERNAME || '',
    password: process.env.SMTP_PASSWORD || '',
    host: process.env.SMTP_HOST || 'smtp.esri.com',
    ssl: false
  }
};
exports.oauth = {
  twitter: {
    key: process.env.TWITTER_OAUTH_KEY || 'J1C2n8PQtyB8HmYv63POA',
    secret: process.env.TWITTER_OAUTH_SECRET || 'QmWsAT8XZsrftvPfxvYLlWhOWN5mJaQQECYiig0e2M'
  },
  facebook: {
    key: process.env.FACEBOOK_OAUTH_KEY || '',
    secret: process.env.FACEBOOK_OAUTH_SECRET || ''
  },
  github: {
    key: process.env.GITHUB_OAUTH_KEY || '9c263b42fdad983fbaa5',
    secret: process.env.GITHUB_OAUTH_SECRET || '33910c156c976eb8e95f889ab00c52a919eeb83b'
  },
  arcgis: {
    key: process.env.ARCGIS_OAUTH_KEY || 'UaGPPkRbGmBV6GTK',
    secret: process.env.ARCGIS_OAUTH_SECRET || 'ba3f18c3da8c42ce833cc006c7afdc5e'
  }
};