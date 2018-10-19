const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('config');

const port = process.env.PORT || 3223;

if(!config.get('jwtPrivateKey')) {
    console.log('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
}

// MW
app.use(express.json());
app.use(cors());

// connect to mongodb
mongoose.connect(config.get('db.host'))
    .then(()=> {console.log(`Connected to MongoDB on at ${config.get('db.host')}.`)})
    .catch((err) => {console.log(err)});

// routes
const items = require('./routes/items');
const recipes = require('./routes/recipes');
const users = require('./routes/users');
const auth = require('./routes/auth')

// routing
app.use('/api/items', items);
app.use('/api/recipes', recipes);
app.use('/api/users', users);
app.use('/api/auth', auth);

app.listen(port, () => { console.log('SERVER IS RUNNING.')});