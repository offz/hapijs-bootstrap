'use strict';

import config from 'config.js';

export default {
    info: {
        title: 'Wilo UEFA Euro 2016 API Documentation',
        version: config.version,
        description: 'This is the documentation for Wilo\'s UEFA Euro betting game.',
        contact: {
            email: 'info@tresmo.de'
        }
    },
    basePath: '/api',
    tags: [{
        name: 'matches',
        description: 'Create and update matches, create bets'
    }, {
        name: 'passwords',
        description: 'Reset password'
    }, {
        name: 'scores',
        description: 'Get the score information'
    }, {
        name: 'sessions',
        description: 'Create or delete sessions'
    }, {
        name: 'statistics',
        description: 'Get user and bet statistics'
    }, {
        name: 'teams',
        description: 'Get team informations'
    }, {
        name: 'users',
        description: 'All resources related to users'
    }, {
        name: 'version',
        description: 'Get API version'
    }],
    auth: config.docAuth,
    payloadType: 'form',
    documentationPath: '/doc',
    swaggerUIPath: '/swagger/',
    pathPrefixSize: 2
};
