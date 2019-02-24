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
const recipes = require('./routes/recipes');
const users = require('./routes/users');
const auth = require('./routes/auth');
const lists = require('./routes/lists');
const items = require('./routes/items');

// routing
app.use('/api/lists', lists);
app.use('/api/recipes', recipes);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/items', items);

app.listen(port, () => { console.log(`SERVER IS RUNNING on port ${port}.`)});