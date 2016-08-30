'use strict';

import pack from '../../../../package.json';
import passwords from './passwords';
import users from './users';
import teams from './teams';
import matches from './matches';
import scores from './scores';
import session from './session';
import statistics from './statistics';
import version from './version';

const routes = [].concat(users, teams, matches, scores, session, statistics, version, passwords);

exports.register = (server, options, next) => {

    server.route(routes);
    return next();
};

exports.register.attributes = {
    name: 'api',
    version: pack.version
};
