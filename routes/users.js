const {User, validateUser, validatePassword}= require('../models/user');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');

router.post('/', async(req, res) => {
    // validate input
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // validate password complexity
    const passwordValidationResult = validatePassword(req.body.password);
    if (passwordValidationResult.error) return res.status(400).send(passwordValidationResult.error.details[0].message);

    // make sure user is not already registered
    let user = await User.findOne( {email: req.body.email });
    if (user) return res.status(400).send('User with this email address already registered.');

    user = new User (_.pick(req.body, ['name', 'email', 'password']));

    // hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    res.send(_.pick(user, ['_id', 'name', 'email']));
});

module.exports = router;