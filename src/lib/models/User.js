'use strict';

import Mongoose from 'mongoose';
import hat from 'hat';
import uniqueValidator from 'mongoose-unique-validator';
import uuid from 'uuid';
import Bcrypt from 'bcrypt';
import _ from 'lodash';

import config from '../../config.js';

const Schema = Mongoose.Schema;
const saltRounds = 10;
const userTypes = ['admin', 'user'];

const UserSchema = new Schema({
    name: { type: String },
    email: { type: String, unique: true, required: true },

    password: { type: String },
    passwordResetToken: { type: String, default: hat.rack() },
});

UserSchema.plugin(uniqueValidator);

/**
 * Data transformation functions.
 * @returns {Object} A plain JavaScript user object
 */
const purgedJSON = function (doc, ret, options) {
    ret.id = ret._id;
    delete ret.password;
    delete ret.__v;
    return ret;
};


/**
 * Save encrypted password to user.
 * Creates an unique hash from salt and hash which can be decrypted via Bcrypt.
 * @param password The plain non-encrypted password
 * @returns {Object} The current user with password hash
 */
UserSchema.methods.savePassword = function(password) {
    const salt = Bcrypt.genSaltSync(saltRounds);
    const hash = Bcrypt.hashSync(password, salt);

    this.password = hash;
    return this.saveAsync();
};

/**
 * Checks whether the attempted plain password is equal.
 * @param attemptedPassword The plain non-encrypted password
 * @returns {boolean} False if password doesn't match
 */
UserSchema.methods.isPasswordIdentical = function (attemptedPassword) {
    if (!this.password) return false;
    return Bcrypt.compareSync(attemptedPassword, this.password);
},

/**
 * Saves a new user with given unique e-mail address to database
 * @param email
 * @param personalNo
 * @returns {Object} The new user object
 */
UserSchema.statics.register = function (email) {
    return new this({ email: email.toLowerCase()})
        .saveAsync()
};

UserSchema.statics.byEmail = function (email) {
    return this.findOneAsync({email: email.toLowerCase()});
};

export default Mongoose.model('User', UserSchema);