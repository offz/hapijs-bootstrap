'use strict';

import async from 'async';
import Joi from 'joi';
import Hoek from 'hoek';
import Hapi from 'hapi';
import Vision from 'vision';
import Inert from 'inert';
import HapiSwagger from 'hapi-swagger';

import docConfig from '../doc';
import database from '../plugins/database';
import authSession from '../plugins/auth/session';
import apiRoutes from '../routes/api';
import config from '../../config.js';

var plugins = [
    {
        register: database,
        options: {
            mongoDbUrl: config.mongoUrl
        }
    },
    {
        register: Vision
    },
    {
        register: Inert
    },
    {
        register: authSession
    },
    {
        register: HapiSwagger,
        options: docConfig
    },
    {
        register: apiRoutes
    }
];

/**
 * Wraps one or more of Hapi's server.register(<plugin>, <pluginsOptions>, callback) calls.
 * See http://hapijs.com/tutorials/plugins for more details.
 *
 * @param server A valid Hapi server instance
 * @param plugins Plugins
 * @param callback
 */
export default function (server, callback = function () {}) {
    console.log('Register plugins.');
    // Assure that `plugins` is an array in a processable format
    Joi.assert(
        plugins,
        Joi.array().items(
            Joi.object({
                register: Joi.any().required(), // Default register
                options: Joi.object(),          // Options to be passed to plugin itself
                pluginOptions: Joi.object()     // Options applied on top of the plugin
            })
        ));

    // Assure that this is an actual instance
    Hoek.assert(server instanceof Hapi.Server, 'Server must be instantiated before plugins registrations');

    // Register each plugin
    async.eachSeries(plugins, (obj, cb) => {
        // Setup plugin with specific options which will be forwarded to this plugin
        let plugin = {
            register: obj.register,
            options: obj.options || {}
        };

        // Add plugin options applying on top of the registered plugin
        // See http://hapijs.com/tutorials/plugins > Plugin options
        let options = obj.pluginOptions || {};

        // Register plugin on server
        server.register(plugin, options, cb);

    }, callback);
};




