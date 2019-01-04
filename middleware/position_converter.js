// middleware that translates the store position recieved from the client (beginning, middle, end) to a number (1, 2, 3)
// the goal is for the mongoDB query to be able to sort the items' positions in acending order before return the list to the client
const Joi = require('joi');


const pos_converter = function (req, res, next) {
    const schema = {
        name: Joi.string(),
        isDone: Joi.boolean(),
        storePosition : Joi.string().valid(['beginning', 'middle', 'end']), 
        _id: Joi.allow(),
        dateStarted: Joi.allow(),
        __v: Joi.allow(),
        dateModified: Joi.allow(),
        addedBy: Joi.allow()
    }

    const result = Joi.validate(req.body, schema)
    if (result.error) { return res.send(result.error.details[0].message)}

    let position = req.body.storePosition;
    if (position == 'beginning'){
        position = 1;
    } else if (position == 'middle') {
        position = 2;
    } else if (position == 'end') {
        position = 3;
    }

    req.body.storePosition = position;
    next();
}

module.exports = pos_converter;