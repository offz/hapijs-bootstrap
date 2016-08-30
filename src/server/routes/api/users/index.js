'use strict';

import createUser from './createUser';
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
    }
];