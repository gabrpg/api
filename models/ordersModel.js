const mongoose = require('mongoose');
const cartModel = require('../models/cartsModel');
const ObjectId = mongoose.Schema.Types.ObjectId;

const order = new mongoose.Schema(
    {
        orderDate: { type: Date, required: true },
        orderTotal: { type: Number, required: true },
        orderMeals: { type: [cartModel.schema], required: false },
        orderUserId: { type: ObjectId, required: true },
    }
);
module.exports = mongoose.model('OrdersModel', order);;