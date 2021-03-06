const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { validate } = require('../models/item');
const _ = require('lodash');
const position_converter = require('../middleware/position_converter');
// const auto_delete = require('../middleware/auto_delete');
const auth = require('../middleware/auth');
const {List} = require('../models/list');

router.post('/:listid', [auth, position_converter], async (req, res) => {
    // validate req body
    const result = validate(req.body);
    if (result.error) return res.send('Joi error:' + result.error.details[0].message);

    async function post_to_List(item_name) {
        // create the new item
        let item = {
            name: item_name,
        };

        if (req.body.storePosition) {
            item.storePosition = req.body.storePosition;
        }

        if (req.body.addedBy) {
            item.addedBy = req.body.addedBy;
        }

        if (req.body.isDone) {
            item.isDone = req.body.isDone;
        }

        if (req.body.dateModified) {
            item.dateModified = Date.now()
        }

        // find the correct list to add the item to
        List.findByIdAndUpdate(req.params.listid, { $push: {items: item} }, (err, list) => {
            if (err) return res.status(404).send('mongoose err:' + err);
            console.log(list)
        });
    }

    const comma_position = req.body.name.indexOf(",")
    if (comma_position != -1) {
        let listOfItems;
        listOfItems = req.body.name.split(',')
        console.log(listOfItems);
        //find the correct list to add each of the items to
        for (const element of listOfItems) {
            post_to_List(element)
        };
        res.status(200).send('Done creating multiple items.')
    } else {
        post_to_List(req.body.name)
        res.status(200).send('Done creating one item.')
    }
});


// get one specific item - for editing
router.get('/:itemid', [auth], async(req, res) => {
    const itemid = new mongoose.Types.ObjectId(req.params.itemid);

    List.findOne({
        'items._id' : itemid 
    })
    .then( (list) => {
        console.log(list.items);
        const item = _.find(list.items, function(i) {
            return i._id == req.params.itemid;
        });
        console.log(item);

        res.send(item)
    })
    .catch( (err) => {
        if (err) return res.status(404).send(err);
    });

    
})

router.put('/:listid/:itemid', [auth, position_converter], (req, res) => {

    let item = req.body;
    item.dateModified = Date.now()

    List.findByIdAndUpdate( req.params.listid, { $pull: { "items" : { "_id" : new mongoose.Types.ObjectId(req.params.itemid)}}}, (err, doc, resp) => {
        if (err) return res.status(404).send(err)
    });

    List.findByIdAndUpdate( req.params.listid, { $push: {items: item} }, (err, list) => {
        if (err) return res.status(404).send('mongoose err:' + err);
        res.send(list);
    });    
});

router.delete('/:listid/:itemid', auth, async(req, res) => {
    List.findByIdAndUpdate( req.params.listid, { $pull: { "items" : { "_id" : new mongoose.Types.ObjectId(req.params.itemid)}}}, (err, doc, resp) => {
        if (err) return res.status(404).send(err)
        res.send(resp);
    });
});


module.exports = router;