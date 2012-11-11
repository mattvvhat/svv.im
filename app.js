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
    idsecret = require('./idsecret');

app.use(express.bodyParser());
app.use('/public', express.static(__dirname + '/public'));
app.use(express.favicon(__dirname + '/public/favicon.ico', { maxAge: 2592000000 }))

// svv.im/
app.get("/", function (req, resp) {
  resp.render("index.ejs");
});

// svv.im/
app.get("/watch", function (req, resp) {
  resp.render("watch.ejs");
});

// svv.im/in/...
app.get("/in/:location", function (req, resp) {
  resp.render("in.ejs");
});

// svv.im/at/...
app.get("/at/:venue", function (req, resp) {
  resp.render("at.ejs");
});

//
app.get("/ping", function (req, resp) {
  resp.set("Content-Type", "text/plain");
  resp.send("pinged");
  io.sockets.send("pinged");
});

//
app.post("/ping", function (req, resp) {
  resp.set("Content-Type", "text/plain");
  resp.send("pinged");
  io.sockets.send("pinged");
});

//
app.get('/xxx', function (req, resp) {
  // Plain-text
  resp.set('Content-Type', 'text/plain');

  if(req.param("hub.challenge") != null)
    resp.send(req.param("hub.challenge"));
  else
    resp.send('');

  io.sockets.send("SUBSCRIPTION");
});

/* POST request to get update from server
 * Get the request. Afterwards, 
 */
app.post('/xxx', function (req, resp) {
  // Respond immediately with nothing
  resp.set('Content-Type', 'text/plain');
  resp.send('');

  io.sockets.send("INSTAGRAM UPDATED");

  // Xxx
  var ids = [];

  // Iterate through all sent objects
  for (var k=0; k < req.body.length; k++) {
    ids.push({
      subscription : req.body[k].subscription_id,
      object : req.body[k].object_id,
      time : req.body[k].time 
    });
  }

  io.sockets.send(JSON.stringify(req.body));

});

function getMedia (tag) {
}
