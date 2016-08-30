'use strict';

import Joi from 'joi';
import Boom from 'boom';
import User from 'lib/models/User';


/**
 * FUNCTIONS
 *
 * Validate user session.
 * @param request
 * @param reply
 */

const handler = function (req, reply) {
    return User.findById( req.auth.credentials.session.userId, (err, user) => {
        if ( err ) return reply(Boom.wrap(err));
        if (user) return reply(user.dto());
        return reply(Boom.forbidden());
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
    headers: Joi.object({
        'x-session-token': Joi.string()
    }).unknown()
};

const respSchema = Joi.object({
    _id: Joi.string(),
    nickname: Joi.string().example('Nickname'),
    email: Joi.string().example('nick@tresmo.de'),
    password: Joi.string(),
    emailConfirmed: Joi.boolean(),
    confirmationMailSent: Joi.boolean(),
    winnerTeamId: Joi.string().example('deu'),
    notificationsEnabled: Joi.boolean()
}).unknown().label('Result');

const response = {
    schema: respSchema
};


export default { handler, respSchema, response, validate };