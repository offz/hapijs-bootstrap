'use strict';

import Joi from 'joi';
import Boom from 'boom';
import User from '../../../../lib/models/User';

/**
 * FUNCTIONS
 *
 * Add a user to database.
 * @param req
 * @param reply
 */

const handler = function (req, reply) {
    const email = req.payload.email;
    User.register(email)
        .then( user => reply({}).code(200))
        .catch(err => reply(Boom.wrap(err, 400)));
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
        email: Joi.string().email({
            minDomainAtoms: 2
        }),
    })
};

const respSchema = Joi.object({
    user: Joi.string()
}).label('Result');

const response = {
    schema: respSchema
};

export default { handler, validate, response, respSchema };
