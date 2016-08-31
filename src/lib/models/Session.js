/*eslint-disable new-cap */

import Mongoose from 'mongoose';
import _ from 'lodash';

var SessionSchema = Mongoose.Schema({
    userId: { type: String, required: true, ref: 'User' }
});


// STATICS
_.extend(SessionSchema.statics, {

    /**
     * Checks whether a session exists.
     * If valid session is found, return session with entire associated user object.
     * @param token The session token to be checked
     * @returns {Object} Credentials, null if session is invalid.
     */
    resolve: function(token) {
        return this.findById(token)
            .populate('userId')
            .execAsync()
            .then( (session) => {
                if (session) {
                    session.user = session.userId;
                    delete session.userId;
                    return Promise.resolve(session);
                }
                return Promise.resolve(null);
            });
    }

});


export default Mongoose.model('Session', SessionSchema);
