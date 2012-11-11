var https = require('https'),
    idsecret = require('./idsecret');

var url = 'api.instagram.com/v1/';

function getmedia (tag) {

  var options = {
    host: 'api.instagram.com',
    port: 443,
    path: '/v1/tags/' + tag + '/media/recent?client_id=' + idsecret.id,
    method: 'GET'
  };


  var data = '';

  var req = https.request(options, function(res) {
    res.on('data', function(d) {
      data += d;
    });

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

        console.log(res);
      }
    });
  });

  req.on('error', function (e) {
    console.error(e);
  });

  req.end();
}

getmedia('red');
