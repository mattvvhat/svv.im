/* SWIM
 * site to list events by location/venue
 * deploy on nodejitsu
 */

var express = require("express"),
    app = express(),
    http = require("http"),
    server = http.createServer(app).listen(process.env.PORT),
    io = require("socket.io").listen(server),
    querystring = require('querystring'), fs = require("fs"), path = require("path");

// ensure that we are parsing raw POST requests, etc.
app.use(express.bodyParser());
app.use('/public', express.static(__dirname + '/public'));

// svv.im/
app.get("/", function (req, resp) {
  resp.render("index.ejs");
});

// svv.im/in/...
app.get("/in/:location", function (req, resp) {
  resp.render("in.ejs");
});

// svv.im/at/...
app.get("/at/:venue", function (req, resp) {
  resp.render("at.ejs");
});

// static files
app.get("/scripts/:script", function (req, resp) {
});
