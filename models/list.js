const mongoose = require('mongoose');
const Joi = require('joi');
const {itemSchema} = require('../models/item');

const List = mongoose.model('List', new mongoose.Schema({
    owner: {
        type: Object, 
        required: true
    },
    users: {
        type: [Object]
    },
    items: {
        type: [itemSchema]
    }
}));

function validateList(body) {
    const schema = {
        users: Joi.array(),
        items: Joi.array()
    }

    return Joi.validate(body, schema);
}

module.exports.List = List;
module.exports.validateList = validateList;