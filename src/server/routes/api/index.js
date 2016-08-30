'use strict';

import pack from '../../../../package.json';
import users from './users';
import sessions from './sessions';

const routes = [].concat(users, sessions);

exports.register = (server, options, next) => {

    server.route(routes);
    return next();
};

exports.register.attributes = {
    name: 'api',
    version: pack.version
};
