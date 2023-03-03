const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const address = new mongoose.Schema(
    {
        address: { type: String, required: true },
        opt: { type: String, required: false },
        city: { type: String, required: true },
        province: { type: String, required: true },
        postalCode: { type: String, required: true },
        userId: { type: ObjectId, required: true },
    }
);
module.exports = mongoose.model('UsersAddresses', address);