const { Item } = require('../models/item');

const auto_delete = async function (req, res, next) {
    // get date from two days ago
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate()-2);
    console.log(cutoff);

    await Item.find( {dateStarted: {$gt : cutoff}}, (err, itm) => {
                if (err) return res.send(err);
                console.log(itm);
            });

    next();
}

module.exports = auto_delete;
