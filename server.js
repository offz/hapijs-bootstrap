'use strict';

var server = require('./src/server');

server.start( (err) => {
    if (err) console.log(err);
});