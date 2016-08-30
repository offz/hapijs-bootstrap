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
    _id: { type: String, unique: true, default: uuid.v4 },

    name: { type: String },
    email: { type: String, unique: true, required: true },

    password: { type: String },
    passwordResetToken: { type: String, default: hat.rack() },
});

UserSchema.plugin(uniqueValidator);

// METHODS
_.extend(UserSchema.methods, {

    /**
     * Data transformation functions.
     * @returns {Object} A plain JavaScript user object
     */
    dto: function () {
        const dto = this.toObject();
        dto.id = this.id;

        delete dto.password;
        delete dto.emailConfirmed;
        delete dto.passwordResetToken;
        delete dto.role;

        return dto;
    },


    /**
     * Save encrypted password to user.
     * Creates an unique hash from salt and hash which can be decrypted via Bcrypt.
     * @param password The plain non-encrypted password
     * @returns {Object} The current user with password hash
     */
    savePassword: function(password) {
        const salt = Bcrypt.genSaltSync(saltRounds);
        const hash = Bcrypt.hashSync(password, salt);

        this.password = hash;
        return this.saveAsync();
    },

    /**
     * Checks whether the attempted plain password is equal.
     * @param attemptedPassword The plain non-encrypted password
     * @returns {boolean} False if password doesn't match
     */
    isPasswordIdentical: function (attemptedPassword) {
        if (!this.password) return false;
        return Bcrypt.compareSync(attemptedPassword, this.password);
    },

    /**
     * Reset password of current user.
     * Will generate a new password token. Does not consider the case when a
     * token was already generated. The older one will be overwritten.
     * @returns {Object} The current user
     */
    resetPassword: function() {
        const newPasswordResetToken = hat();
        this.passwordResetToken = newPasswordResetToken;
        const templateData = {
            resetPasswordUrl: config.resetPasswordUrl + '?token=' + newPasswordResetToken + '&id=' + this.id
        };
        return mail.send({
            to: this.email,
            subject: 'Passwort zurücksetzen',
            html: mailResetPasswordTempl(templateData)
        }).then( () => {
            this.passwordResetToken = newPasswordResetToken;
            return this.saveAsync();
        });
    }
});

// STATICS
_.extend(UserSchema.statics, {

    /**
     * Saves a new user with given unique e-mail address to database
     * @param email
     * @param personalNo
     * @returns {Object} The new user object
     */
    register: function (email, personalNo) {
        return new this({ email: email.toLowerCase(), personalNo: personalNo })
            .saveAsync()
            .then((user) => {
                return user.sendConfirmationMail();
            }, (err) => {
                if (err.name !== 'ValidationError') return Promise.reject(err);
                
                return this.byEmail(email)
                    .then((user) => {
                        if (!user.emailConfirmed) return user.sendConfirmationMail();
                        else return Promise.reject(err);
                    });
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    },
    
    byEmail: function (email) {
        return this.findOneAsync({email: email.toLowerCase()});
    }
});

export default Mongoose.model('User', UserSchema);