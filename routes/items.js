const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { Item, validate } = require('../models/item');
const _ = require('lodash');

// Save new item
router.post('/', async (req, res) => {
    // validate req body

    const result = validate(req.body);
    if (result.error) return res.send(result.error.details[0].message);

    const item = new Item({
        name : req.body.name
    });
    await item.save()
        .then( (i) => res.send(i))
        .catch( (err) => res.send(err));
});

router.get('/', async(req, res) => {
    Item.find()
        .then( (i) => res.send(i))
        .catch( (err) => res.send(err));
});


module.exports = router;