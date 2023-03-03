const mongoose = require('mongoose');

const stats = new mongoose.Schema(
    {
        name: { type: String, required: true },
        sales: { type: Number, required: true}
    }
);
module.exports = mongoose.model('Stats', stats);