'use strict';

//dependencies
var config = require('./config'),
    express = require('express'),
    mongoStore = require('connect-mongo')(express),
    http = require('http'),
    path = require('path'),
    passport = require('passport'),
    mongoose = require('mongoose'),
    helmet = require('helmet');

//create express app
var app = express();

//keep reference to config
app.config = config;

//setup the web server
app.server = http.createServer(app);

//setup mongoose
app.db = mongoose.createConnection(config.mongodb.uri);
app.db.on('error', console.error.bind(console, 'mongoose connection error: '));
app.db.once('open', function () {
  //and... we have a data store
});

//config data models
require('./models')(app, mongoose);

//setup the session store
app.sessionStore = new mongoStore({ url: config.mongodb.uri });

//config express in all environments
app.configure(function(){
  //settings
  app.disable('x-powered-by');
  app.set('port', config.port);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('strict routing', true);
  app.set('project-name', config.projectName);
  app.set('company-name', config.companyName);
  app.set('system-email', config.systemEmail);
  app.set('crypto-key', config.cryptoKey);
  app.set('require-account-verification', config.requireAccountVerification);

  //smtp settings
  app.set('smtp-from-name', config.smtp.from.name);
  app.set('smtp-from-address', config.smtp.from.address);
  app.set('smtp-credentials', config.smtp.credentials);

  //twitter settings
  app.set('twitter-oauth-key', config.oauth.twitter.key);
  app.set('twitter-oauth-secret', config.oauth.twitter.secret);

  //github settings
  app.set('github-oauth-key', config.oauth.github.key);
  app.set('github-oauth-secret', config.oauth.github.secret);

  //facebook settings
  app.set('facebook-oauth-key', config.oauth.facebook.key);
  app.set('facebook-oauth-secret', config.oauth.facebook.secret);

  //arcgis settings
  app.set('arcgis-oauth-key', config.oauth.arcgis.key);
  app.set('arcgis-oauth-secret', config.oauth.arcgis.secret);

  //middleware
  app.use(express.logger('dev'));
  app.use(express.compress());
  app.use(express.favicon(__dirname + '/public/favicon.ico'));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.urlencoded());
  app.use(express.json());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({
    secret: config.cryptoKey,
    store: app.sessionStore
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  helmet.defaults(app);

  //response locals
  app.use(function(req, res, next) {
    res.locals.user = {};
    res.locals.user.defaultReturnUrl = req.user && req.user.defaultReturnUrl();
    res.locals.user.username = req.user && req.user.username;
    next();
  });

  //mount the routes
  app.use(app.router);

  //error handler
  app.use(require('./views/http/index').http500);

  //global locals
  app.locals.projectName = app.get('project-name');
  app.locals.copyrightYear = new Date().getFullYear();
  app.locals.copyrightName = app.get('company-name');
  app.locals.cacheBreaker = 'br34k-01';
  app.locals.featureServiceURL = 'https://services1.arcgis.com/wQnFk5ouCfPzTlPw/arcgis/rest/services/BigTripin/FeatureServer';
  app.locals.users = [{
    name: 'Andrew',
    avatar: 'https://2.gravatar.com/avatar/a25421f6c79d5f381fab65c82abf85e8?d=https%3A%2F%2Fidenticons.github.com%2F3f67fd97162d20e6fe27748b5b372509.png&r=x&s=400'
  }, {
    name: 'AL',
    avatar: 'https://1.gravatar.com/avatar/fe330c3cb09248e16d65ec74d1455a5f?d=https%3A%2F%2Fidenticons.github.com%2Faccf9b1ac769272fd9720ca5d85bb1ba.png&r=x&s=400'
  }, {
    name: 'Julie',
    avatar: 'https://2.gravatar.com/avatar/e95ec66e340beccf9b9c76ba7102e27a?d=https%3A%2F%2Fidenticons.github.com%2F1950d625a1d7cb7ffc8ac2d496c4174d.png&r=x&s=400'
  }, {
    name: 'Tom',
    avatar: 'https://0.gravatar.com/avatar/b7ba58abd7dba707a1df4fc9f2b50af8?d=https%3A%2F%2Fidenticons.github.com%2Fed5e3348d8061480ee9e57659512cea6.png&r=x&s=400'
  }];
});

//config express in dev environment
app.configure('development', function(){
  app.use(express.errorHandler());
});

//setup passport
require('./passport')(app, passport);

//route requests
require('./routes')(app, passport);

//setup utilities
app.utility = {};
app.utility.sendmail = require('drywall-sendmail');
app.utility.slugify = require('drywall-slugify');
app.utility.workflow = require('drywall-workflow');

//listen up
app.server.listen(app.get('port'), function(){
  //and... we're live
});
