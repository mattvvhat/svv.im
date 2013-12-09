#!/usr/local/bin/node

var Instagram = require('instagram-node-lib');
var secrets   = require('./secrets.json');

Instagram.set('client_id',      secrets.client_id);
Instagram.set('client_secret',  secrets.client_secret);

Instagram.tags.recent({
});

Instagram.tags.recent({
  name      : 'yolo',
  complete  : function (data) {
    console.log(data);
  }
});
