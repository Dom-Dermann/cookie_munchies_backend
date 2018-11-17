const express = require('express');
const router = express.Router();
const List = require('../models/list');
const auth = require('../middleware/auth');

router.get('/:id', auth, async (req, res) => {
    List.findById(req.params.id)
        .then( (l) => res.status(200).send(l))
        .catch( (e) => res.status(400));
});

router.post('/', auth, async (req, res) => {
    console.log('post started')

    const newList = new List({
        users: [req.user],
        items: []
    });

    await newList.save()
        .then( (l) => res.status(200).send(l))
        .catch( (e) => res.status(400).send(e));
});

module.exports = router;