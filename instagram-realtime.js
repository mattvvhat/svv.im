/* exported getTagMedia */

var request = require('request');
var server  = require('https');
var events  = require('events');
var util    = require('util');

// ////////// /////
/////////
/// /  ///////// //
//// 
//// / /// ///
//////
////////////////

/**
 * StreamBuilder
 * A class used in the creation of InstagramStream objects.
 * @param {object} opts an object containing the properties [ 'client_id', 'client_secret', 'callback_url', 'verify_token' ]
 */
function StreamBuilder (opts) {
  opts = opts || {};
  this.params = {};
  this.params.client_id     = opts.client_id      ? opts.client_id      : '';
  this.params.client_secret = opts.client_secret  ? opts.client_secret  : '';
  this.params.callback_url  = opts.callback_url   ? opts.callback_url   : '';
  this.params.verify_token  = opts.verify_token   ? opts.verify_token + '' : 'TOKEN_' + Math.random();
}

/**
 * Sets a Property of the Builder Object
 * This sets a property of the StreamBuilder object. All future streams made
 * from this StreamBuilder will match this.
 * @param {string} property a character-sting. One of [ 'client_id', 'client_secret', 'callback_url' ]
 * @param {string} val      a value for the property
 * @return {!StreamBuilder} this StreamBuilder object
 */
StreamBuilder.prototype.set = function set (property, val) {
  if (property in this.params) {
    this.params[property] = val;
  }
  else {
    throw 'Invalid property: `' + propery + '`';
  }
  return this;
};

/**
 * Create a New Stream Object
 * Creates a new InstagramStream object from the specified settings.
 */
StreamBuilder.prototype.make = function () {
  var stream = new InstagramStream();
  stream.set('client_id',     this.params.client_id);
  stream.set('client_secret', this.params.client_secret);
  stream.set('callback_url',  this.params.callback_url);
  stream.set('verify_token',  this.params.verify_token);
  return stream;
}


util.inherits(InstagramStream, events.EventEmitter);
/**
 * Construct an InstagramStream
 * Create an InstagramStream object that can subscribe/unsubscribe and have
 * triggers.
 * @param {object} opts a set of properties
 * @inherits {EventEmitter} Child of EventEmitter class
 */
function InstagramStream (opts) {
  'use strict';

  events.EventEmitter.call(this);

  opts = opts || {};
  this.params = {};
  this.params.client_id     = opts.client_id      ? opts.client_id      : '';
  this.params.client_secret = opts.client_secret  ? opts.client_secret  : '';
  this.params.callback_url  = opts.callback_url   ? opts.callback_url   : '';
  this.params.verify_token  = opts.verify_token   ? opts.verify_token + '' : 'TOKEN_' + Math.random();

  // Actual returns from subscription
  this.id           = '';
  this.tag          = '';
  this.callback_url = '';

  // Determine when
  this.last = {};
  this.last.min_id = undefined;
  this.last.max_id = undefined;

  // Meta options
  this.meta = {};
  this.meta.tag = opts.tag ? opts.tag : '';

  // 
  this.lastBody = undefined;
}

/**
 * Get Verify Token
 * Returns a character-string representing the verify_token for the
 * InstagramStream. This is an identifier used to keep track of which
 * subscription issued the push request.
 * @return {string} a character-string representing this stream's verify_token
 */
InstagramStream.prototype.verify_token = function () {
  return this.params.verify_token;
}

/**
 * Subscribe to a Tag
 * Sends a multi-part form POST request to instagram to initiate a tag
 * @param {!options} options an options object used in the `request` node library.
 * @param {callback} success a function callback on success
 * @param {callback} failure a function callback on failure
 */
InstagramStream.prototype.subscribe = function subscribe (tag, success, failure) {
  'use strict';

  var url = 'https://api.instagram.com/v1/subscriptions/';

  this.tag = tag;

  var postData = {
    client_id     : this.params.client_id,
    client_secret : this.params.client_secret,
    object        : 'tag',
    aspect        : 'media',
    object_id     : this.tag,
    callback_url  : this.params.callback_url
  };

  var that = this;

  request.post(
    url,
    { form : postData },
    function (error, response, body) {
      var message = {};

      try {
        message = JSON.parse(body);
      }
      catch (err) {
        message = {};
      }

      throwHttpError(response.statusCode);

      that.tag          = message.data.object_id;
      that.id           = message.data.id;
      that.callback_url = message.data.callback_url;

      if (typeof success === 'function' && response.statusCode === 200) {
        success.apply();
      }
      else {
        failure.apply();
      }
    }
  );
};

/**
 * Unsubscribe from an Instagram Subscription
 * Send a DELETE Https-request to instagram.
 * @param {!options} options an options object used in the `request` node library.
 * @param {callback} success a function callback on success
 * @param {callback} failure a function callback on failure
 */
InstagramStream.prototype.unsubscribe = function unsubscribe(object_id, success, failure) {
  // Create url
  var url = 'https://api.instagram.com/v1/subscriptions';
  url += '?client_secret='  + this.params.client_secret;
  url += '&client_id='      + this.params.client_id;
  url += '&object='         + object_id;

  // Send a DELETE request
  request.del(
    url,
    function (error, response, body) {
      var message = {};

      try {
        message = JSON.parse(body);
      }
      catch (err) {
        message = {};
      }

      if (typeof success === 'function' && response.statusCode === 200) {
        success.apply();
      }
      else {
        failure.apply();
      }
    }
  );
};

/**
 * Set a Property for Blah
 * Sets a property for talking to Instagram.
 * @param {string} property a character-sting. One of [ 'client_id', 'client_secret', 'callback_url' ]
 * @param {string} val      a value for the property
 */
InstagramStream.prototype.set = function set (property, val) {
  if (property in this.params) {
    this.params[property] = val;
  }
  else {
    throw 'Invalid property: `' + propery + '`';
  }
};

/**
 * Get Last Body
 * Send a DELETE Https-request to instagram.
 * @param {string}   tag      a character-string specifying
 * @param {callback} success  a function callback on success
 * @param {callback} failure  a function callback on failure
 */
InstagramStream.prototype.getLastBody = function (success, failure) {
  return this.lastBody;
};

/**
 * Get Only Newest Tag Media 
 * Send a DELETE Https-request to instagram.
 * @param {string}   tag      a character-string specifying
 * @param {callback} success  a function callback on success
 * @param {callback} failure  a function callback on failure
 */
InstagramStream.prototype.getNewTagMedia = function (success, failure) {
  this.getTagMedia({ min_id : this.last.max_id }, success, failure);
};

/**
 * Get Recent Tag Media Instagram Subscription
 * Send a DELETE Https-request to instagram.
 * @param {string}   tag      a character-string specifying
 * @param {callback} success  a function callback on success
 * @param {callback} failure  a function callback on failure
 */
InstagramStream.prototype.getTagMedia = function (opts, success, failure) {
  // Parameters for getting the media
  opts = opts || {};
  opts.min_tag_id = opts.min_id;
  opts.max_tag_id = opts.max_id;

  var url = 'https://api.instagram.com/v1';
  url += '/tags/' + this.tag;
  url += '/media/recent';
  url += '?client_id='  + this.params.client_id;

  // if (opts.min_id !== undefined) {
  //   url += '&min_id='     + opts.min_id;
  // }

  // if (opts.max_tag_id !== undefined) {
  //   url += '&max_id='     + opts.max_id;
  // }

  
  var that = this;

  // Send a GET request
  request.get(
    url,
    function (error, response, body) {
      var message = {};

      try {
        message = JSON.parse(body);
      }
      catch (err) {
        message = {};
      }

      if (message.pagination.next_max_tag_id) {
        that.last.min_id = message.pagination.next_max_tag_id;
      }
      else {
        console.log('Warning: next_max_tag_id is null');
      }

      if (message.pagination.min_tag_id) {
        that.last.max_id = message.pagination.min_tag_id;
      }
      else {
        console.log('Warning: next_max_tag_id is null');
      }

      var obj = undefined;

      try {
        obj = JSON.parse();
      }
      catch (err) {
        obj = {};
      }

      if (response.statusCode === 200) {
        success.call(undefined, body, response);
      }
      else {
        failure.call(undefined, error, response);
      }
    }
  );
}


// Fin
exports.StreamBuilder   = StreamBuilder;
exports.InstagramStream = InstagramStream;









// Extra (???)
function RequestCallbackWrapper (success, failure) {
  return function (error, response, body) {
    if (!error && response.statusCode === 200) {
      if (typeof success === 'function') {
        success.call(undefined, body, response);
      }
      else {
        console.log('SUCCESS: 200 response from request');
      }
    }
    else {
      if (typeof failure  === 'function') {
        failure.call(undefined, body, response);
      }
      else {
        console.log('FAILURE: non-200 response from request');
      }
    }
  };
}

/**
 * Notifies Application of HTTP-response Codes that Should Throw Errors
 * Throws errors that are caused by HTTP-response codes. That is, all non-200
 * status-codes. This throws a standard Error so that the stack trace is visible on NodeJS.
 * @param {int} statusCode an integer representing a HTTP-response code
 * @throws Error Any of 'OAuthException', 'TooManyRequestsPerHour', 'UnrecognizableError'
 */
function throwHttpError (statusCode) {
  var error = { name : '', message : '' };
  switch (statusCode) {
    case 200:
      /* In this case, everything is good, and we go on with our day. */
      return;
    case 400:
      throw new Error('OAuthException. Your authentication credentials are invalid.');
    case 503:
      throw new Error('TooManyRequestsPerHour. Your subscription is making too many requests to Instagram per hour.');
    default:
      throw new Error('UnrecognizableError. Instagram returned ' + statusCode + '. The `instagram-realtime` package does not recognize this; please refer to Instagram\'s developer manual for more information.');
  }
}
