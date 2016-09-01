'use strict';

import Mongoose from 'mongoose';
import async from 'async';
import * as server from '../src/server';
import config from '../src/config';

const checkMongoDb = function () {
    if (config.mongoUrl.indexOf('localhost') === -1) {
        console.warn('Running tests is only allowed on localhost.');
        process.exit(0);
    }
};

checkMongoDb();

const resetDb = function (done) {
    checkMongoDb();
    Mongoose.connect(config.mongoUrl, () => {
        return Mongoose.connection.db.dropDatabase(done);
    });
};

export default { server, resetDb };


