const mongoose = require('mongoose');
const menuMealModel = require('./menu/menuMealModel');
const ObjectId = mongoose.Schema.Types.ObjectId;

const cart = new mongoose.Schema(
    {
        cartMeal: { type: menuMealModel.schema, required: true },
        cartStore: { type: String, required: true },
        cartQty: { type: Number, required: true, min: 1, default: 1}
    }
);
module.exports = mongoose.model('CartsModel', cart);