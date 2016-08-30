'use strict';

import config from '../config.js';

export default {
    info: {
        title: 'HapiJS bootstrap',
        version: config.version,
        description: 'This is a simple bootstrap project.'
    },
    basePath: '/api',
    tags: [{
        name: 'sessions',
        description: 'Create or delete sessions'
    }, {
        name: 'users',
        description: 'All resources related to users'
    }],
    // auth: config.docAuth,
    payloadType: 'form',
    documentationPath: '/doc',
    swaggerUIPath: '/swagger/',
    pathPrefixSize: 2
};
