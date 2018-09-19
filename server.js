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
    .then(()=> {console.log('Connected to MongoDB on mLab.')})
    .catch((err) => {console.log(err)});

// routes
const items = require('./routes/items');

// routing
app.use('/api/items', items);

app.listen(port, () => { console.log('SERVER IS RUNNING.')});