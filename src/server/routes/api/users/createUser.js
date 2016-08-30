'use strict';

import Joi from 'joi';
import Boom from 'boom';
import User from 'lib/models/User';

/**
 * FUNCTIONS
 *
 * Add a user to database.
 * @param req
 * @param reply
 */

const handler = function (req, reply) {
    const email = req.payload.email;
    const personalNo = req.payload.personalNo;

    User.register(email, personalNo)
        .then( (user) => {
            
            return reply({
                userId: user.id
            });
            
        })
        .catch((err) => {
            return reply(Boom.wrap(err, 400));
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
        email: Joi.string().email({
            minDomainAtoms: 2
        }),
        personalNo: Joi.string()
    })
};

const respSchema = Joi.object({
    userId: Joi.string()
}).label('Result');

const response = {
    schema: respSchema
};

export default { handler, validate, response, respSchema }
