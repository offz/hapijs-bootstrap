'use strict';

import Boom from 'boom';
import Session from '../../../lib/models/Session';

exports.register = (plugin, options, next) => {

    plugin.auth.scheme('session', () => {
        return {
            authenticate: (req, reply) => {
                const sessionToken = req.headers['x-session-token'];

                if (!sessionToken) return reply(Boom.forbidden());

                return Session
                    .resolve(sessionToken)
                    .then( (session) => {
                        if (!session) return reply(Boom.forbidden());
                        return reply.continue({
                            credentials: {
                                session: {
                                    id: session.id,
                                    userId: session.user.id
                                },
                                scope: session.user.role
                            }
                        });
                    })
                    .catch( (err) => {
                        return reply(Boom.wrap(err));
                    });
            }
        };
    });

    plugin.auth.strategy('session', 'session');
    return next();
};

exports.register.attributes = {
    name: 'authSession'
};
