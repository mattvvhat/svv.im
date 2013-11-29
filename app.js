/**
 * Instagram Stream Using an Instagram API 
 * Server-side subscribe and begin listening to a post in the app
 * @author  Matt Owen
 * @since   11-17-2013
 * @note    ...
 */

console.log('Instagram Harvester v0.0.4');
console.log('--------------------------');
console.log('Wat do you know about that');
console.log('');
console.log('');

// Requires and framework libraries
var express = require("express"), fs = require("fs");

// App setup
var app     = express();
var server  = require('http').createServer(app).listen(process.env.PORT);
var step    = require('step');

// API keys and secrets
var secrets = require('./secrets.json');

//
///
///
///////
////
/////
///////
//

// Socket
var io = require("socket.io").listen(server, { logs : false, log : false });

//
/////
////
///////
/////
//////////////
////

// Local instagram module
var i = require('./instagram-realtime.js');

var streams = {
  a : new i.InstagramStream(),
  b : new i.InstagramStream(),
  c : new i.InstagramStream(),
  d : new i.InstagramStream()
  // selfie          : new i.InstagramStream()
};

// Startup instagram subscription
function startupSeqError () {
  console.log('startup sequence failed!');
}

step(
  function () {
    setTimeout(this, 3000);
  },
  function () {
    console.log('* Start new subscription procedure');
    console.log('  * Waiting 1.5 seconds');
    setTimeout(this, 1500);
  },
  function () {
    console.log('  * Setting authentication');
    {
      streams.a.set('client_id',     secrets.client_id);
      streams.a.set('client_secret', secrets.client_secret);
      streams.a.set('callback_url',  secrets.url + '/' + secrets.callback_path);
      streams.a.set('verify_token',  'a');
    }
    {
      streams.b.set('client_id',     secrets.client_id);
      streams.b.set('client_secret', secrets.client_secret);
      streams.b.set('callback_url',  secrets.url + '/' + secrets.callback_path);
      streams.b.set('verify_token',  'b');
    }
    {
      streams.c.set('client_id',     secrets.client_id);
      streams.c.set('client_secret', secrets.client_secret);
      streams.c.set('callback_url',  secrets.url + '/' + secrets.callback_path);
      streams.c.set('verify_token',  'c');
    }
    {
      streams.d.set('client_id',     secrets.client_id);
      streams.d.set('client_secret', secrets.client_secret);
      streams.d.set('callback_url',  secrets.url + '/' + secrets.callback_path);
      streams.d.set('verify_token',  'd');
    }
    this();
  },
  function () {
    console.log('  * Unsubscribing from old subscriptions');
    streams.a.unsubscribe('all', this, startupSeqError);
  },
  function () {
    console.log('  * Subscribing to new subscription');
    streams.a.subscribe('instavid',       this, startupSeqError);
    streams.b.subscribe('videooftheday',  this, startupSeqError);
    streams.c.subscribe('video',          this, startupSeqError);
    // streams.d.subscribe('yolo',           this, startupSeqError);
  },
  function () {
    streams.a.getNewTagMedia(
      function (body, response) {
        io.sockets.send((body));
      },
      function (error, response) {
        console.log('* Transfer failure');
      }
    );
  },
  function () {
    io.sockets.on('connection', function () {
      streams.b.getNewTagMedia(
        function (body, response) {
          io.sockets.send((body));
        },
        function (error, response) {
          console.log('* Transfer failure');
        }
      );
    });
  },
  function () {
    streams.a.on('connect', function () {
      streams.a.getNewTagMedia(
        function (body, response) {
          io.sockets.send((body));
        },
        function (error, response) {
          console.log('* Transfer failure');
        }
      );
    });
    streams.b.on('received', function () {
      streams.b.getNewTagMedia(
        function (body, response) {
          io.sockets.send((body));
        },
        function (error, response) {
          console.log('* Transfer failure');
        }
      );
    });
    streams.c.on('received', function () {
      streams.c.getNewTagMedia(
        function (body, response) {
          io.sockets.send((body));
        },
        function (error, response) {
          console.log('* Transfer failure');
        }
      );
    });
  },
  function () {
    console.log('  * Finished procedure');
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
app.get("/", function (req, resp) {
  resp.render("index.ejs", { url : secrets.url });
});

//
//
/////
///
///
/////
////
//

// Callback URL for hub.challenge after subscription
app.get('/' + secrets.callback_path, function (req, resp) {
  resp.set('Content-Type', 'text/plain');
  resp.send(req.param('hub.challenge'));
});

// Posting a new picture
app.post('/' + secrets.callback_path, function (req, resp) {
  resp.set('Content-Type', 'text/plain');
  resp.send(req.param('hub.challenge'));

  var message = req.body;
  var tag = message.object_id;

  var length = message.length;


  console.log('* Post Request Received');

  while (length--) {
    var result = message[length];
    var tag = result.object_id;

    console.log('  * Subscription ID');
    console.log('    * Tag    = ' + result.object_id);
    console.log('    * Typeof = ' + (typeof result));

    switch (tag) {
    case 'instavid':
      streams.a.emit('received');
      break;
    case 'videooftheday':
      streams.b.emit('received');
      break;
    case 'video':
      streams.c.emit('received');
      break;
    }

  }
});


// Redirect URI
app.get('/' + secrets.redirect_path, function (req, resp) {
  resp.set('Content-Type', 'text/plain');
  resp.send('Redirected.');
});

//
////
//  ////////////
/////
//
/////
//
/////
///

// File to inform robots what's going on here
app.get('/robots.txt', function (req, resp) {
  fs.readFile("robots.txt", "utf-8", function (err, data) {
    resp.set('Content-Type', 'text/plain');
    resp.send(data);
  });
});

// For people that actually use humans.txt
app.get('/humans.txt', function (req, resp) {
  fs.readFile("humans.txt", "utf-8", function (err, data) {
    resp.set('Content-Type', 'text/plain');
    esp.send(data);
  });
});

////
////////////
/////
//
/// // /// //
////
//
//

/**
 * Process picture Response
 *
 */
function processPictureResponse (messages) {

  // Init counter
  var count = {};

  // Count number of each tag that was updated
  for (var i = 0; i < messages.length; i++) {
    var m = messages[i];
    if (m.object_id in count)
      count[m.object_id] += 1;
    else
      count[m.object_id] = 01;
  }

  for (key in count) {
    for (tag in streams) {
      console.log('(' + key + ', ' + tag + ')');
    }
  }

  streams.instavid.getNewTagMedia(success, failure);

  function success (body, response) {
    io.sockets.send(body);
  }

  function failure (error, response) {
    io.sockets.send(JSON.stringify({ success : false }));
  }
}

/**
 * Send Messages to Clients
 *
 */
function sendMessageToClients (message) {
  function success (body, response) {
    console.log('success:   ' + 'sending new information to clients');
    io.sockets.send(body);
  }

  function failure (error, response) {
    console.log('failure:   ' + 'sending nothing to clients');
  }
}
