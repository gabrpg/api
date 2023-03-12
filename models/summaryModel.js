const mongoose = require('mongoose');

const summary = new mongoose.Schema(
    {
        nbBuyer: { type: Number, required: true },
        sales: { type: Number, required: true},
        startingDate: { type: Date, required: true},
        endingDate: {type: Date, required: true}
    }
);
module.exports = mongoose.model('Summary', summary);