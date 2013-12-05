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
  'use strict';
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

  success = typeof success === 'function' ? success : fallback.subscribeSuccess;
  failure = typeof failure === 'function' ? failure : fallback.subscribeFailure;

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

  // @@@
  var thisStream = this;
  var message = {};

  request.post(
    url,
    { form : postData },
    function (error, response, body) {
      try {
        message = JSON.parse(body);
      }
      catch (err) {
      }
      if (response.statusCode === 200) {
        thisStream.tag          = message.data.object_id;
        thisStream.id           = message.data.id;
        thisStream.callback_url = message.data.callback_url;
        success.apply(thisStream);
      }
      else {
        if (attempts < 10) {
          attemptSubscribe();
        }
        else {
          failure.apply(thisStream);
        }
      }
    }
  );

  /*
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
      if (response.statusCode === 200) {
        that.tag          = message.data.object_id;
        that.id           = message.data.id;
        that.callback_url = message.data.callback_url;
        success.apply(thisStream);
      }
      else {
        failure.apply(thisStream);
      }
    }
  );
  */
};

/**
 * Unsubscribe from an Instagram Subscription
 * Send a DELETE Https-request to instagram.
 * @param {!options} options an options object used in the `request` node library.
 * @param {callback} success a function callback on success
 * @param {callback} failure a function callback on failure
 */
InstagramStream.prototype.unsubscribe = function unsubscribe(object_id, success, failure) {
  'use strict';

  success = typeof success === 'function' ? success : fallback.unsubscribeSuccess;
  failure = typeof failure === 'function' ? failure : fallback.unsubscribeFailure;

  var thisStream = this;

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

      if (response && response.statusCode === 200) {
        success.apply(thisStream);
      }
      else {
        failure.apply(thisStream);
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
 * Get Only Newest Tag Media 
 * Send a DELETE Https-request to instagram.
 * @param {string}   tag      a character-string specifying
 * @param {callback} success  a function callback on success
 * @param {callback} failure  a function callback on failure
 */
InstagramStream.prototype.getNewTagMedia = function (success, failure) {
  'use strict';

  this.getTagMedia({}, success, failure);
};

/**
 * Get Recent Tag Media Instagram Subscription
 * Send a DELETE Https-request to instagram.
 * @param {string}   tag      a character-string specifying
 * @param {callback} success  a function callback on success
 * @param {callback} failure  a function callback on failure
 */
InstagramStream.prototype.getTagMedia = function (opts, success, failure) {
  'use strict';

  success = typeof success === 'function' ? success : fallback.unsubscribeSuccess;
  failure = typeof failure === 'function' ? failure : fallback.unsubscribeFailure;

  // Is the tag empty?
  if (this.tag !== 'string' && this.tag !== '') {
    console.log('* [getTagMedia Error] Tag is empty'.red);
    failure.apply(this);
    return;
  }

  // Parameters for getting the media
  opts = opts || {};
  opts.min_tag_id = opts.min_id;
  opts.max_tag_id = opts.max_id;

  var url = 'https://api.instagram.com/v1';
  url += '/tags/' + this.tag;
  url += '/media/recent';
  url += '?client_id='  + this.params.client_id;

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
        console.log(body);
        console.log('[instagram-realtime] Invalid JSON return'.red);
        console.error(err);
        message = {};
        return;
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

      if (response && response.statusCode === 200) {
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

/**
 *
 *
 */

var fallback = {
  unsubscribeFailure : function () {
    console.log('* Unsubscribe failure'.red);
  },
  unsubscribeSuccess : function () {
    console.log('* Unsubscribe success'.green);
  },
  subscribeFailure : function () {
    console.log('* Subscribe failure'.red);
  },
  subscriptionSuccess : function () {
    console.log('* Subscribe success'.green);
  }
};
