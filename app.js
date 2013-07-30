/* SWIM
 * site to list events by location/venue
 * deploy on nodejitsu
 */

var express = require("express"),
    app = express(),
    http = require("http"),
    https = require("https"),
    server = http.createServer(app).listen(process.env.PORT),
    io = require("socket.io").listen(server),
    querystring = require('querystring'), fs = require("fs"), path = require("path"),
    idsecret = require('./idsecret'),
    instagram = require('./instagram')
    ;

app.use(express.bodyParser());
app.use('/public', express.static(__dirname + '/public'));
app.use(express.favicon(__dirname + '/public/favicon.ico', { maxAge: 2592000000 }))

// svv.im/
app.get("/", function (req, resp) {
  var ip = req.headers['X-Forwarded-For'] ? req.headers['X-Forwarded-For'] : req.connection.remoteAddress;
  resp.render("index.ejs");
});
// svv.im/in/...
app.get("/in/:location", function (req, resp) { }); 
// svv.im/at/...
app.get("/at/:venue", function (req, resp) {
  resp.render("at.ejs");
});
//
app.get("/ping", function (req, resp) {
  resp.set("Content-Type", "text/plain");
  resp.send("pinged");
});
//
app.post("/ping", function (req, resp) {
  resp.set("Content-Type", "text/plain");
  resp.send("pinged");
});
//
app.get('/xxx', function (req, resp) {
  resp.set('Content-Type', 'text/plain');
  resp.send(req.param("hub.challenge"));
  instagram.getmedia('pool', function (images) {
    io.sockets.send(JSON.stringify(images));
  });
});
/**
 * POST request to get update from server
 * Get the request. Afterwards, 
 */
app.post('/xxx', function (req, resp) {
  resp.set('Content-Type', 'text/plain');
  resp.send(req.param("hub.challenge"));
  instagram.getmedia('pool', function (images) {
    io.sockets.send(JSON.stringify(images));
  });
});
