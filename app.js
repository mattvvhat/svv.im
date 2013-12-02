/**
 * Instagram Stream Using an Instagram API 
 * Server-side subscribe and begin listening to a post in the app
 * @author  Matt Owen
 * @since   11-17-2013
 * @note    ...
 */

// Requires and framework libraries
var express = require("express"), fs = require("fs");
var app     = express();
var server  = require('http').createServer(app).listen(process.env.PORT);
var step    = require('step');
var io      = require("socket.io").listen(server, { log : false });
var colors  = require('colors');

// API keys and secrets
var secrets = require('./secrets.json');

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
builder.set('client_id',     secrets.client_id);
builder.set('client_secret', secrets.client_secret);
builder.set('callback_url',  secrets.url + '/' + secrets.callback_path);

var stream = builder.make();

// Startup instagram subscription
function _startup_error () {
  console.log('ERROR: Startup sequence failed'.bad);
}

step(
  function () {
    stream.subscribe('instavid', this, _startup_error);
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

// Callback URL for new post
app.post('/' + secrets.callback_path, function (req, resp) {
  resp.set('content-type', 'text/plain');
  resp.send(req.param('hub.challenge'));
});

// robots.txt
app.get('/robots.txt', function (req, resp) {
  fs.readFile('robots.txt', 'utf-8', function (err, data) {
    resp.set('Content-Type', 'text/plain');
    resp.send(data);
  });
});

// humans.txt
app.get('/humans.txt', function (req, resp) {
  fs.readFile('humans.txt', 'utf-8', function (err, data) {
    resp.set('Content-Type', 'text/plain');
    esp.send(data);
  });
});
