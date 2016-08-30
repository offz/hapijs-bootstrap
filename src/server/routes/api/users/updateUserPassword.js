'use strict';

import Boom from 'boom';
import Joi from 'joi';
import User from 'lib/models/User';


/**
 * FUNCTIONS
 *
 * Add or update a password of an user.
 * @param request
 * @param reply
 */


function handler(req, reply) {
    let password = req.payload.password;
    let passwordResetToken = req.payload.passwordResetToken;
    let userId = req.params.userId;

    return User.findAsync({
            _id: userId
        }).then( (users) => {

            if (!users.length) {
                return reply(Boom.badRequest('No user was found.'));
            };

            let user = users[0];

            if (user.passwordResetToken !== passwordResetToken) {
                return Boom.unauthorized('Invalid password reset token.');
            }

            if (!user.isPasswordIdentical(password)) {

                return user
                    .savePassword(password)
                    .then( () => {

                        reply({
                            success: true
                        });
                    });
            } else {
                return reply(Boom.badRequest('Attempted password is identical with existing one.'));
            }

    }).catch( (err) => {

        reply(err);
    });
};


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
        password: Joi.string().min(6).max(20).required(),
        passwordResetToken: Joi.string().required()
    }),
    params: {
        userId: Joi.string().required()
    }
};

const response = {
    schema: Joi.object({
        success: Joi.boolean().required()
    })
};

export default {
    handler: handler,
    validate: validate,
    response: response
};

