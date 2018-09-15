const express = require('express');
const app = express();
const mongoose = require('mongoose');
const config = require('config');
const path = require('path');

const port = process.env.PORT || 3223;

// connect to mongodb
mongoose.connect(config.get('db.host'))
    .then(()=> {console.log('Connected to MongoDB on mLab.')})
    .catch((err) => {console.log(err)});

// routes
const items = require('./routes/items');

// point static folder to the angular 'dist' folder
// app.use(express.static(path.join(__dirname, 'dist')));

// Body Parser MW
app.use(express.json());

// routing
app.use('/api/items', items);

app.listen(port, () => { console.log('SERVER IS RUNNING.')});