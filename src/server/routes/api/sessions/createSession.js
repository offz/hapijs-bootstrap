'use strict';

import Joi from 'joi';
import Boom from 'boom';
import Session from 'lib/models/Session';
import User from 'lib/models/User';

/**
 * FUNCTIONS
 *
 * Create a session and save it in database.
 * @param request
 * @param reply
 */
    
function handler (req, reply) {
    let email = req.payload.email;
    let password = req.payload.password;

    return User.findAsync({ email: email })
        .then( (users) => {

            if (!users.length) {
                return reply(Boom.notFound('User does not exist.'));
            }

            const user = users[0];

            if (user.isPasswordIdentical(password)) {

                return new Session({
                    userId: user.id
                })
                .saveAsync()
                .then( (session) => {

                    return reply({
                        sessionToken: session._id
                    });

                });

            } else {
                return reply(Boom.unauthorized());
            }

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
    payload: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    })
};

const respSchema = Joi.object({
    sessionToken: Joi.string()
}).label('Result')

const response = {
    schema: respSchema
};


module.exports = { handler, validate, respSchema, response };
