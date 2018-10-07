const mongoose = require('mongoose');
const Joi = require('joi');

const Recipe = mongoose.model('Recipe', new mongoose.Schema( {
    description: {
        type: String, 
        required: true
    }
}));

function recipeValidator(body) {
    const schema = {
        description: Joi.string().required()
    }

    return Joi.validate(body, schema);
}

module.exports.Recipe = Recipe;
module.exports.recipeValidator = recipeValidator;