const express = require('express');
const router = express.Router();
const {List, validateList} = require('../models/list');
const auth = require('../middleware/auth');
const _ = require('lodash');
const mongoose = require('mongoose');


// get all lists the user is a part of
router.get('/all', auth, async (req, res) => {
    List.find(
        { users: { $elemMatch: { _id: mongoose.Types.ObjectId(req.user._id) }}},
        (err, lists) => {
        if (err) {
            return res.status(404).send(err);
        }
        res.send(lists);
    });
});


router.get('/:id', auth, async (req, res) => {
    List.findById(req.params.id)
        .then( (l) => {
            const response = _.omit(l, ['owner.password']);
            res.status(200).send(response);
        })
        .catch( (e) => res.status(400));
});





module.exports = router;