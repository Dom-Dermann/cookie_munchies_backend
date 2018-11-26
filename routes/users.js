const {User, validateUser, validatePassword}= require('../models/user');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const {List} = require('../models/list');

router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

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

    // sign and send token as part of the header
    // there is no email checking here for now. Once the user registers they get a valid jwt token and can keep browsing
    const token = user.generateAuthToken();

    // create a new shopping list that lists the new user as owner
    const newList = new List({
        owner: user,
        users: [],
        items: []
    });

    await newList.save()
        .then( (l) => {
            // once the new list is saved, the list _id is added to the user object that own the list for later reference
            user.ownsList = l._id;
            user.save();
        })
        .catch( (e) => res.status(400).send(e));

    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

router.get('/', auth, async (req, res)=> {
    res.send(await User.find());
})

module.exports = router;