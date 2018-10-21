const mongoose = require('mongoose');
const Joi = require('joi');
const PasswordComplexity = require('joi-password-complexity');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema( {
    name: {
        type: String, 
        required: true,
        minlength: 1, 
        maxlength: 50
    },
    email: {
        type: String, 
        required: true,
        minlength: 1, 
        maxlength: 255, 
        unique: true
    },
    password: {
        type: String, 
        required: true,
        minlength: 1, 
        maxlength: 1024
    }
});

// Information Expert Principle: the object with all the information - user in this case - 
// should be the object that generates the token
// below function referenes the user with 'this'
userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({
        _id: this._id,
        name: this.name
    }, config.get('jwtPrivateKey'));
    return token;
}

const User = mongoose.model('Users', userSchema);

function validateUser(user) {
    const schema = {
        name: Joi.string().min(1).max(50).required(),
        email: Joi.string().min(1).max(255).required().email(),
        password: Joi.string().min(1).max(255).required()
    };

    return Joi.validate(user, schema);
};

function validatePassword(password) {
    const complexityOptions = {
        min: 5, 
        max: 30,
        lowerCase: 1, 
        upperCase: 1, 
        symbol: 1
    };
    return Joi.validate(password, new PasswordComplexity(complexityOptions));
}

module.exports.User = User;
module.exports.validateUser = validateUser;
module.exports.validatePassword = validatePassword;