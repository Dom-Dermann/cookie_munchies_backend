const mongoose = require('mongoose');
const Joi = require('joi');
const PasswordComplexity = require('joi-password-complexity');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema( {
    first_name: {
        type: String, 
        required: true,
        minlength: 1, 
        maxlength: 50
    },
    last_name: {
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
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    ownsList: {
        type: mongoose.Schema.Types.ObjectId
    }
});

// Information Expert Principle: the object with all the information - user in this case - 
// should be the object that generates the token
// below function referenes to the user with 'this'
userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({
        _id: this._id,
        name: this.name, 
        isAdmin: this.isAdmin
    }, config.get('jwtPrivateKey'));
    return token;
}

const User = mongoose.model('Users', userSchema);

function validateUser(user) {
    const schema = {
        first_name: Joi.string().min(1).max(50).required(),
        last_name: Joi.string().min(1).max(50).required(),
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
module.exports.userSchema = userSchema;
module.exports.validateUser = validateUser;
module.exports.validatePassword = validatePassword;