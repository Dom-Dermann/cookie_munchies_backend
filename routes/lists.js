const express = require('express');
const router = express.Router();
const {List, validateList} = require('../models/list');
const auth = require('../middleware/auth');
const _ = require('lodash');

router.get('/:id', auth, async (req, res) => {
    List.findById(req.params.id)
        .then( (l) => {
            const response = _.omit(l, ['owner.password']);
            res.status(200).send(response);
        })
        .catch( (e) => res.status(400));
});

router.post('/items', auth, async (req, res) => {
    // post new items to list
});

router.post('/users', auth, async (req, res) => {
    // post new users to list
});

module.exports = router;