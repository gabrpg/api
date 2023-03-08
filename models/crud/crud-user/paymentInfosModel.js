const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const paymentInfo = new mongoose.Schema(
    {
        paymentInfoCardNumber: { type: Number, required: true },
        paymentInfoCVV: { type: Number, required: true },
        paymentInfoExpiryMonth: { type: Number, required: true },
        paymentInfoExpiryYear: { type: Number, required: true },
        paymentInfoUserId: { type: ObjectId, required: true },
    }
);
module.exports = mongoose.model('PaymentInfosModel', paymentInfo);