'use strict';

import Boom from 'boom';
import Joi from 'joi';
import User from '../../../../lib/models/User';


/**
 * FUNCTIONS
 *
 * Add or update a password of an user.
 * @param request
 * @param reply
 */

function handler(req, reply) {
    const password = req.payload.password;
    const passwordResetToken = req.payload.passwordResetToken;
    const userId = req.params.userId;

    return User.findByIdAsync(userId)
        .then( user => {

            if (!user) return reply(Boom.badRequest('No user was found.'));
            if (user.passwordResetToken !== passwordResetToken) return reply(Boom.unauthorized('Invalid password reset token.'));
            if (user.isPasswordIdentical(password)) return reply(Boom.badRequest('Attempted password is identical with existing one.'));

            return user.savePassword(password)
                .then( () => reply({}).code(204));

    }).catch( err => reply(err));
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
        password: Joi.string().min(6).max(20).required(),
        passwordResetToken: Joi.string().required()
    }),
    params: {
        userId: Joi.string().required()
    }
};

export default {
    handler: handler,
    validate: validate
};

