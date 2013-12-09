/* exported getTagMedia */

var request = require('request');
var server  = require('https');
var events  = require('events');
var util    = require('util');

// 

var Instagram = require('instagram-node-lib');
var secrets   = require('./secrets.json');

// Okay

util.inherits(Stream, events.EventEmitter);
/**
 *
 *
 */
function Stream (opts) {

  // Inherit from EventEmitter
  events.EventEmitter.call(this);

  // Privileged 
  opts = opts || {};
  _params = {};
  _params.client_id     = opts.client_id      ? opts.client_id      : '';
  _params.client_secret = opts.client_secret  ? opts.client_secret  : '';
  _params.callback_url  = opts.callback_url   ? opts.callback_url   : '';
  _params.verify_token  = opts.verify_token   ? opts.verify_token + '' : 'TOKEN_' + Math.random();

  //
  this.on('connect', function () {
  });

  this.on('disconnect', function () {
  });

  this.on('received', function () {
  });

  this.on('error', function () {
  });

  //
  1;
}


/**
 * Sets a Property of the Builder Object
 * This sets a property of the StreamBuilder object. All future streams made
 * from this StreamBuilder will match this.
 * @param {string} property a character-sting. One of [ 'client_id', 'client_secret', 'callback_url' ]
 * @param {string} val      a value for the property
 * @return {!StreamBuilder} this StreamBuilder object
 */
Stream.prototype.set = function () {
  if (property in _params) {
    _params[property] = val;
  }
  else {
    throw 'Invalid property: `' + propery + '`';
  }
  return this;
};

Stream.prototype.subscribe = function () {
};

Stream.prototype.unsubscribe = function () {
};

var s = new Stream();
s.emit('whatever');

/**
 *
 *
 */
