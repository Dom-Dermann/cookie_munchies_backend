const { Item } = require('../models/item');

const auto_delete = async function (req, res, next) {
    // get date from two days ago
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate()-2);

    // prepare array to hold items
    let oldItems;

    await Item.find( { dateModified : {$lt: cutoff}})
        .remove( (err, itms) => {
            if (err) return res.send(err);
            console.log(`These items were deleted ${itms} because they exceed the cutoff date of 2 days.`);
        });

    next();
}

module.exports = auto_delete;