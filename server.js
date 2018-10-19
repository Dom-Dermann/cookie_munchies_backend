const express = require('express');
const app = express();
const mongoose = require('mongoose');
const config = require('config');
const cors = require('cors');

const port = process.env.PORT || 3223;

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

// routing
app.use('/api/items', items);
app.use('/api/recipes', recipes);
app.use('/api/users', users);

app.listen(port, () => { console.log('SERVER IS RUNNING.')});