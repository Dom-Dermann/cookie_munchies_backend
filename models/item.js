const mongoose = require('mongoose');
const Joi = require('joi');

const Item = mongoose.model('Item', new mongoose.Schema({
    name : {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 300
    },
    isDone : {
        type: Boolean, 
        required: false,
        default: false
    },
    storePosition: {
        type: Number, 
        enum: [1, 2, 3],
        default: 0
    },
    dateStarted : {
        type: Date, 
        required: false,
        default: Date.now()
    },
    dateModified: {
        type: Date, 
        required: false
    }
}));

// validate item
function validate(body) {
    const schema = {
        name: Joi.string().required(),
        isDone: Joi.boolean(),
        storePosition: Joi.number(),
        dateModified: Joi.allow()
    }
    return Joi.validate(body, schema);
}

module.exports.Item = Item;
module.exports.validate = validate;