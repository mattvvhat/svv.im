/**
 * mind is a razorbla.de
 */


// Requires and framework libraries
var express = require('express');
var step    = require('step');
var fs      = require('fs');
var nodemailer = require('nodemailer');
var colors = require('colors');

// App setup
var app     = express();
var server  = require('http').createServer(app).listen(process.env.PORT);
var io      = require('socket.io').listen(server, { log : false });

// API keys and secrets
var secrets = require('./secrets.json');

console.log('Mind is a razorblade'.green);
console.log('--------------------'.green);
console.log('Node template for socket-based stuff'.green);

var smtpTransport = nodemailer.createTransport('SMTP', {
  host: secrets.host,
  port: secrets.port,
  secureConnection: true,
  use_authentication: true,
  auth: {
    user: secrets.email,
    pass: secrets.pass
  }
});

// Expressjs middleware
app.use(express.favicon(__dirname + '/public/image/favicon.ico', { maxAge: 2592000000 }))
app.use('/public/css',    express.static(__dirname + '/public/css'));
app.use('/public/js',     express.static(__dirname + '/public/js'));
app.use('/public/obj',    express.static(__dirname + '/public/obj'));
app.use('/public/fonts',    express.static(__dirname + '/public/fonts'));
app.use('/public/image',  express.static(__dirname + '/public/image'));
app.use(express.bodyParser());
app.use(app.router);
app.use(function(req, res, next) {
  res.set('Content-type', 'plain/text');
  res.send('', 404);
});

app.get('/', function (req, resp) {
  resp.render('index.ejs');
});

app.get('/graph', function (req, resp) {
  resp.render('graph.ejs');
});

app.get('/three', function (req, resp) {
  resp.render('three.ejs');
});

app.post('/email', function (req, resp) {
  var name    = req.param('name');
  var email   = req.param('email');
  var company = req.param('company');
  var website = req.param('website');
  var message = req.param('message');

  var _email = {};

  _email.text = '';
  _email.text += 'Name ...... ' + name + '\n';
  _email.text += 'E-mail .... ' + email + '\n';
  _email.text += 'Company ... ' + company + '\n';
  _email.text += 'Website ... ' + website + '\n\n';
  _email.text += message;

  _email.from     = 'matt@planwork.us';
  _email.to       = 'not.mattowen@gmail.com';
  _email.subject  = 'Job Inquiry : ' + (new Date());

  smtpTransport.sendMail(_email, _callback);

  function _callback (error, response) {
    if (error) {
      resp.set('Content-Type', 'application/json');
      resp.send(JSON.stringify({ resp : 1, message : 'Somethign went really bad.' }));
    }
    else {
      resp.set('Content-Type', 'application/json');
      resp.send(JSON.stringify({ resp : 0, message : 'Everything went well.' }));
    }
  }
});

app.get('/humans.txt', function (req, resp) {
  fs.readFile("humans.txt", "utf-8", function (err, data) {
    resp.set('Content-Type', 'text/plain');
    resp.send(data);
  });
});

app.get('/robots.txt', function (req, resp) {
  fs.readFile("robots.txt", "utf-8", function (err, data) {
    resp.set('Content-Type', 'text/plain');
    resp.send(data);
  });
});

app.use(function(err, req, res, next){
  console.log("!");

  next();
});
