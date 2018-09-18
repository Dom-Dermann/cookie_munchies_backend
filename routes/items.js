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

router.put('/:id', (req, res) => {

    Item.findByIdAndUpdate(req.params.id, {$set: req.body}, (err, i) => {
        if (err) return res.send(err);
        res.send(i);
    })
})

router.delete('/:id', async(req, res) => {
    Item.findOneAndRemove({ _id: req.body.id})
        .then()
});


module.exports = router;