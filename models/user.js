const mongoose = require('mongoose');

const User = mongoose.model('Users', new mongoose.Schema( {
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
}));

function validateUser(user) {
    const schema = {
        name: Joi.string().min(1).max(50).required(),
        email: Joi.string().min(1).max(255).required().email(),
        password: Joi.string().min(1).max(255).required()
    };
};

module.exports.User = User;
module.exports.validateUser = validateUser;