'use strict';

import createUser from './createUser';
import updateUser from './updateUser';
import getBets from './getBets';
import validateUserSession from './validateUserSession';

export default [
    {
        method: 'GET',
        path: '/api/users/me',
        handler: validateUserSession.handler,
        config: {
            description: 'Validate user session',
            notes: 'Validate user session.',
            tags: ['api'],
            auth: 'session',
            validate: validateUserSession.validate,
            response: validateUserSession.response,
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success',
                            schema: validateUserSession.respSchema
                        },
                        403: { description: 'Forbidden if session is gone' },
                        404: { description: 'Not found' }
                    }
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/api/users/{userId}/bets',
        handler: getBets.handler,
        config: {
            description: 'Get bets from a given user',
            notes: 'Get bets from a given user.',
            tags: ['api'],
            auth: 'session',
            pre: [{
                method: getBets.checkUserId
            }],
            validate: getBets.validate,
            response: getBets.response,
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success',
                            schema: getBets.respSchema
                        },
                        403: { description: 'Forbidden' },
                        404: { description: 'Not found' }
                    }
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/api/users',
        handler: createUser.handler,
        config: {
            description: 'Add a single user',
            notes: 'Add a single user.',
            tags: ['api'],
            auth: false,
            validate: createUser.validate,
            response: createUser.response,
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success',
                            schema: createUser.respSchema
                        },
                        400: { description: 'Bad Request' },
                        404: { description: 'Not found' }
                    }
                }
            }
        }
    },
    {
        method: ['PATCH'],
        path: '/api/users/{userId}',
        handler: updateUser.handler,
        config: {
            description: 'Update properties of one user',
            notes: 'Updates any properties of one user. If a password token is provided, no further authentication is needed.' +
            'However, authentication AND password token at once is not allowed.',
            tags: ['api'],
            auth: {
                mode: 'try',
                strategy: 'session'
            },
            pre: [{
                method: updateUser.checkUserId,
                assign: 'user'
            }, {
                method: updateUser.checkReCaptcha
            }, {
                method: updateUser.checkAuthOrPasswordToken
            }, {
                method: updateUser.checkNicknameUnique
            }, {
                method: updateUser.checkWinnerTeamDeadline
            }],
            validate: updateUser.validate,
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: { description: 'Success' },
                        400: { description: 'Bad Request' },
                        401: { description: 'Unauthorized' },
                        404: { description: 'Not found' }
                    }
                }
            }
        }
    }
];