'use strict';

import Promise from 'bluebird';
import Mongoose from 'mongoose';

Promise.promisifyAll(Mongoose);

exports.register = (plugin, options, next) => {
    Mongoose.connect(options.mongoDbUrl, {poolSize: 100}, (err) => {
        console.log('error');
        if (err) throw new Error(err);

        plugin.ext({
            type: 'onPreStop',
            method: function(req, reply) {
                Mongoose.disconnect(reply);
            }
        });

        return next();
    });
};

exports.register.attributes = {
    name: 'mongoose',
    version: '1.0.0'
};
