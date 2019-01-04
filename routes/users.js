const {User, validateUser, validatePassword}= require('../models/user');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const {List} = require('../models/list');
const mongoose = require('mongoose');

// show the currently logged on user's details
router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

// get all users on the platform
router.get('/', auth, async (req, res)=> {
    res.send(await User.find());
});

// show all users that are authorized on the currently logged on users's list
router.get('/:admin', auth, async(req, res) => {
    const list = await List.findOne( { 'owner._id' : mongoose.Types.ObjectId(req.params.admin) });
    res.status(200).send(list.users);
});

// create a new user
router.post('/', async(req, res) => {
    // validate input
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // validate password complexity
    const passwordValidationResult = validatePassword(req.body.password);
    if (passwordValidationResult.error) return res.status(400).send('Password must be between 5 and 30 characters, one lowercase, one uppercase and one symbol.');

    // make sure user is not already registered
    let user = await User.findOne( {email: req.body.email });
    if (user) return res.status(400).send('User with this email address already registered.');

    user = new User (_.pick(req.body, ['first_name', 'last_name', 'email', 'password']));

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

    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'first_name', 'last_name', 'email']));
});


// add a user to your shopping list that can add, delete and edit it
router.post('/:userid', auth, async(req, res) => {

    // get list ID associated with logged in user
    let list = await User.findById( req.user._id);
    list = list.ownsList

    // get the entire user object associated with the user ID provided
    const user = await User.findById( req.params.userid );

    // see if this user is already part of that list
    listToAddTo = await List.findById(list);
    usersInList = listToAddTo.users;
    for ( u of usersInList ) {
        if ( req.params.userid == u._id ) {
            return res.status(409).send('User is already on your list.');
        }
    }

    // put the user object into the logged in user's list
    List.findByIdAndUpdate( list, { $push : {users: user}}, (err, resp) => {
        if (err) {
            res.status(404).send(err);
        }
        res.send(resp);
    });
});

module.exports = router;