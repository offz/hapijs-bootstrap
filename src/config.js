const nodeEnvFile = require('node-env-file');
const path = require('path');
const fs = require('fs');
const pack  = require('../package.json');
nodeEnvFile(path.join(__dirname, '../.env'), {raise: false});
const env = process.env;


const config = {
    name: pack.name,
    version: pack.version,

    port: env.PORT || 8080,

    mongoUrl: env.MONGOLAB_URI || 'mongodb://localhost/hapijs-bootstrap',
};

module.exports = config;
