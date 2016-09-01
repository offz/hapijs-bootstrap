'use strict';

import Hapi from 'hapi';

import config from '../config.js';
import registerPlugins from './utils/registerPlugins';

let server;

const init = function(next) {
    server = new Hapi.Server();

    // Setup connection with label `web`
    server.connection({
        port: config.port,
        routes: {
            cors: {
                headers: ['Access-Control-Allow-Headers', 'Origin', 'Accept', 'Accept-Encoding', 'Accept-Language',
                    'Content-Type', 'Cache-Control', 'Connection', 'DNT', 'Host', 'Pragma', 'Upgrade-Insecure-Requests',
                    'User-Agent', 'Authorization', 'x-session-token', 'x-requested-with'],
                credentials: true
            }
        },
        router: {
            stripTrailingSlash: true
        },
        labels: ['web']
    });

    return registerPlugins(server, () => next(server));
};

const start = function(next) {
    return init( () => {
        return server.start( err => {
            if (err) return next(err);
            console.log('Server started at port ' + config.port);
            return next();
        });
    });
};

const stop = function(next) {
    return server.stop( err => {
        if (err) return next(err);
        server = null;
        console.log('Server stopped.');
        return next();
    });
};

export {init, start, stop};

