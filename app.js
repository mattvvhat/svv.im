/**
 * Instagram Stream Using an Instagram API 
 * Server-side subscribe and begin listening to a post in the app
 * @author  Matt Owen
 * @since   11-17-2013
 * @note    ...
 */

// Requires and framework libraries
var express = require("express"), fs = require("fs");

// App setup
var app     = express();
var server  = require('http').createServer(app).listen(process.env.PORT);
var step    = require('step');
var colors  = require('colors');
var io = require("socket.io").listen(server, { log : false });

// API keys and secrets
var secrets = require('./secrets.json');

//
/////
////
///////
/////
//////////////
////

// Local instagram module
var i = require('./instagram-realtime.js');

// Set colors theme
colors.setTheme({
  great : 'rainbow',
  good  : 'green',
  okay  : 'blue',
  bad   : 'red'
});

// Startup message
console.log('svv.im'.okay);

// Create a StreamBuilder
var builder = new i.StreamBuilder();
var url = secrets.url + '/' + secrets.callback_path;
console.log(url.red);
builder.set('client_id',     secrets.client_id);
builder.set('client_secret', secrets.client_secret);
builder.set('callback_url',  secrets.url + '/' + secrets.callback_path);

// Build some streams
var streams = [
  builder.make(),
  builder.make(),
  builder.make(),
  builder.make(),
  builder.make()
];

// Startup instagram subscription
function startupSeqError () {
  console.log('ERROR: Startup sequence failed'.bad);
}

var subscribe = (function () {
  var attempts = 0;
  return function (next) {
    try {
      streams[0].subscribe('yolo',      next, startupSeqError);
      streams[1].subscribe('swag',      next, startupSeqError);
      streams[2].subscribe('idgafos',   next, startupSeqError);
      streams[3].subscribe('video',     next, startupSeqError);
      streams[4].subscribe('instavid',  next, startupSeqError);
    }
    catch (err) {
      console.log(err);
      if (attempts < 20) {
        console.log('subscription failure... waiting 10s and trying again'.error);
        setTimeout(subscribe, 5000);
      }
      else {
        console.log('subscription failure... done attempting'.error);
      }
    }
  };
})();

step(
  function () {
    console.log('* Delaying subscriptions for 10 seconds'.okay);
    setTimeout(this, 10);
  },
  function () {
    console.log('* Unsubscribing from old subscriptions'.okay);
    streams[0].unsubscribe('all', this, startupSeqError);
  },
  function () {
    console.log('* Subscribing to new subscription'.okay);
    // subscribe(this);
  },
  function () {
    console.log('* Creating connection event'.okay);
    io.sockets.on('connection', function (socket) {
      streams[3].getNewTagMedia(
        function (body, response) {
          io.sockets.send(body);
        },
        function (error, response) {
          console.log('* Transfer failure'.bad);
        }
      );
    });
  },
  function () {
    for (var i = 0; i < streams.length; i++) {
      var s = streams[i];
      s.on('connect', function () {
        s.getNewTagMedia(this, _failure);
      });
    }
    function _failure () {
      console.log('failure'.bad);
    }
  },
  function () {
    console.log('* Startup procedure finished'.good);
  }
);

// Body parser
app.use(express.bodyParser());
app.use('/public', express.static(__dirname + '/public'));
app.use(express.favicon(__dirname + '/public/favicon.ico', { maxAge: 2592000000 }));

//
////
///////
/////
////
////////
//

// Root document
app.get('/', function (req, resp) {
  resp.render('index.ejs', { url : secrets.url });
});

// Callback URL for hub.challenge after subscription
app.get('/' + secrets.callback_path, function (req, resp) {
  resp.set('Content-Type', 'text/plain');
  resp.send(req.param('hub.challenge'));
});

// Posting a new picture
var what = secrets.callback_path;
console.log(what.red);

app.post('/' + secrets.callback_path, function (req, resp) {
  resp.set('content-type', 'text/plain');
  resp.send(req.param('hub.challenge'));

  var message = req.body;
  var tag = message.object_id;
  var length = message.length;

  console.log('* Post Request Received'.okay);

  while (length--) {
    var result = message[length];
    var tag = result.object_id;

    console.log('* Subscription ID'.okay);
    console.log(('* Tag    = ' + result.object_id).okay);
    console.log(('* Typeof = ' + (typeof result)).okay);

    for (var i = 0; i < streams.length; i++) {
      if (tag === streams[i].tag) {
        streams[i].emit('received');
        return;
      }
    }
  }
});


// Redirect URI
app.get('/' + secrets.redirect_path, function (req, resp) {
  resp.set('Content-Type', 'text/plain');
  resp.send('Redirected.');
});

// File to inform robots what's going on here
app.get('/robots.txt', function (req, resp) {
  fs.readFile('robots.txt', 'utf-8', function (err, data) {
    resp.set('Content-Type', 'text/plain');
    resp.send(data);
  });
});

// For people that actually use humans.txt
app.get('/humans.txt', function (req, resp) {
  fs.readFile('humans.txt', 'utf-8', function (err, data) {
    resp.set('Content-Type', 'text/plain');
    esp.send(data);
  });
});
