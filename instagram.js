var // I want to dance 'till dawn
    https = require('https'),
    idsecret = require('./idsecret');

var lastid = 0;

/* 
 * Get tagged media
 */
function getmedia (tag, callback) {

  var o = {
    host: 'api.instagram.com',
    port: 443,
    path: '/v1/tags/' + tag + '/media/recent?client_id=' + idsecret.id,
    method: 'GET'
  };

  var data = '', results = [];

  var req = https.request(o, function(res) {
    // Get a chunk of data
    res.on('data', function(d) {
      data += d;
    });

    // Data has stopped coming in
    res.on('end', function () {
      var o = JSON.parse(data);

      var max_id = o.pagination.next_max_tag_id,
          min_id = o.pagination.min_tag_id, next_url;

      for (var k=0; k < o.data.length; k++) {
        var res = {
          images : o.data[k].images,
          id  : o.data[k].id,
          filter : o.data[k].filter
        };

        results.push(res);
      }

      callback.call(undefined, results);
    });
  });

  req.on('error', function (e) {
    console.error(e);
  });

  req.end();
}

// EXPORTS
exports.getmedia = getmedia;
