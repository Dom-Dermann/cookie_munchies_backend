const express = require('express');
const router = express.Router();
const { itemSchema, validate } = require('../models/item');
const _ = require('lodash');
const position_converter = require('../middleware/position_converter');
const auto_delete = require('../middleware/auto_delete');
const auth = require('../middleware/auth');
const List = require('../models/list');

router.post('/:listid', [auth, position_converter], async (req, res) => {
    // validate req body
    const result = validate(req.body);
    if (result.error) return res.send(result.error.details[0].message);

    // create the new item
    let item = {
        name: req.body.name,
    };

    if (req.body.storePosition) {
        item.storePosition = req.body.storePosition;
    }

    if (req.body.isDone) {
        item.isDone = req.body.isDone;
    }

    if (req.body.dateModified) {
        item.dateModified = Date.now()
    }

    //find the correct list to add the item to
    List.findByIdAndUpdate(req.params.listid, { $push: {items: item} }, (err, list) => {
        if (err) return res.status(404).send(err);
        res.send(list);
    });
});

router.get('/', [auth, auto_delete] ,async(req, res) => {
    Item.find()
        .sort({storePosition: 1})
        .then( (i) => res.send(i))
        .catch( (err) => res.send(err));
});

router.put('/:id', [auth, position_converter], (req, res) => {

    let item = req.body;
    item.dateModified = Date.now()

    Item.findByIdAndUpdate(req.params.id, {$set: item}, (err, i) => {
        if (err) return res.send(err);
        res.send(i);
    })
})

router.delete('/:id', auth, async(req, res) => {
    Item.findByIdAndRemove(req.params.id)
        .then((i) => res.send(i))
        .catch( (err) => res.send(err));
});


module.exports = router;