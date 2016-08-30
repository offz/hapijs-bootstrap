'use strict';

import Hapi from 'hapi';

import config from '../config.js';
import registerPlugins from './utils/registerPlugins';

let server;


function start(next) {
    console.log('Server starting.');

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

    console.log('Start registering plugins.');
    // Register plugins
    return registerPlugins(server, (err) => {
        if (err) return next(err);
        console.log('Register plugins successful.');

        return server.start( (err) => {
            if (err) return next(err);

            console.log('Server started at', server.select('web').info.uri);
            return next(err);
        });
    });
}

function stop(next) {
    server.stop( err => {
        if (err) return next(err);
        server = null;
        console.log('Server stopped.');
        return next(err);
    });
}

export {start, stop};

