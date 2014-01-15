var express = require('express');
var colors = require('colors');

var app     = express();
var server  = require('http').createServer(app).listen(process.env.PORT || 5000);
var io      = require('socket.io').listen(server, { log : false });

var passport = require('passport');
var SoundCloudStrategy = require('passport-soundcloud').Strategy;

// API keys and secrets
var secrets = require('./secrets.json');

// PASSPORT

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new SoundCloudStrategy(
  {
    clientID      : secrets.soundcloud.client_id,
    clientSecret  : secrets.soundcloud.client_secret,
    callbackURL   : "http://svv.im/auth",
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      // To keep the example simple, the user's SoundCloud profile is returned
      // to represent the logged-in user.  In a typical application, you would
      // want to associate the SoundCloud account with a user record in your
      // database, and return that user instead.
      return done(null, profile);
    });
  }
));

// EXPRESS MIDDLEWARE
app.configure(function() {
  // app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  /*
  app.use(function (req, resp, next) {
    resp.header('Access-Control-Allow-Origin',   'http://soundcloud.com http://*.soundcloud.com');
    resp.header('Access-Control-Allow-Methods',  'GET,PUT,POST,DELETE');
    resp.header('Access-Control-Allow-Headers',  'Content-Type');
    next();
  });
  */
  app.use('/public/css',    express.static(__dirname + '/public/css'));
  app.use('/public/img',    express.static(__dirname + '/public/img'));
  app.use('/public/js',     express.static(__dirname + '/public/js'));
  app.use('/public/obj',    express.static(__dirname + '/public/obj'));
  app.use('/public/fonts',  express.static(__dirname + '/public/fonts'));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});

app.get('/', function (req, resp) {
  console.log(req.user);
  resp.render('index.jade', { user: req.user });
});

app.get('/callback', function(req, resp) {
  resp.render('callback.jade');
});

/*

app.get('/login', function(req, resp) {
  resp.render('login.jade', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, resp) {
  resp.render('account.jade', { user: req.user });
});


app.get('/logout', function(req, resp) {
  req.logout();
  resp.redirect('/');
});

app.get(
  '/auth',
  passport.authenticate('soundcloud', { failureRedirect: '/login' }), function(req, resp) {
    resp.redirect('/');
    console.log('!!! auth');
  }
);

*/


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login')
}
