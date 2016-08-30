'use strict';

import Joi from 'joi';
import Boom from 'boom';

import Session from 'lib/models/Session';

/**
 * FUNCTIONS
 *
 * Delete a session from database.
 * @param request
 * @param reply
 */
    
function handler (req, reply) {
    const credentials = req.auth.credentials;

    if (req.params.token !== credentials.session.id) {
        return reply(Boom.forbidden());
    }

    return Session.remove({ _id: credentials.session.id })
        .then( () => {
            reply().code(204);
        });
}


/**
 * VALIDATION
 *
 * Validation schemas and functions.
 * Note: The main object structure is predetermined by a route's config object.
 * See http://hapijs.com/tutorials/validation for details.
 *
 */

const validate = {
    params: {
        token: Joi.string().required()
    },
    headers: Joi.object({
        'x-session-token': Joi.string()
    }).unknown()
};

module.exports = { handler, validate };
