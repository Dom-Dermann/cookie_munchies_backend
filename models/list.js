const mongoose = require('mongoose');
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

module.exports = List;