'use strict';

const createSession = require('./createSession');
const deleteSession = require('./deleteSession');

module.exports = [
    {
        method: 'POST',
        path: '/api/sessions',
        handler: createSession.handler,
        config: {
            description: 'Create new session for user',
            notes: 'Creates a new session and returns a specific user\'s session ID for further authentication.',
            tags: ['api'],
            auth: false,
            validate: createSession.validate,
            response: createSession.response,
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'Success',
                            schema: createSession.respSchema
                        },
                        400: { description: 'Bad Request' },
                        404: { description: 'Not found' }
                    }
                }
            }
        }
    },
    {
        method: 'DELETE',
        path: '/api/sessions/{token}',
        handler: deleteSession.handler,
        config: {
            description: 'Delete a session',
            notes: 'Deletes an active session',
            tags: ['api'],
            auth: 'session',
            validate: deleteSession.validate,
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: { description: 'Success'},
                        403: { description: 'Forbidden' }
                    }
                }
            }
        }
    }
];