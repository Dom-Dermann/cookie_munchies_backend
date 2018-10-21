const {User}= require('../models/user');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

router.post('/', async(req, res) => {
    // validate input
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // see if email exists
    let user = await User.findOne( {email: req.body.email });
    if (!user) return res.status(400).send('Invalid email or password.');

    // see if password is correct by bcrypt
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid email or password.');

    // if all is correct, send jwt
    const token = user.generateAuthToken();
    res.send(token);
});

function validateUser(user) {
    const schema = {
        email: Joi.string().min(1).max(255).required().email(),
        password: Joi.string().min(1).max(255).required()
    };

    return Joi.validate(user, schema);
};

module.exports = router;