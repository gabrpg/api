const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const menuMeal = new mongoose.Schema(
    {
        menuMealName: { type: String, required: true },
        menuMealPrice: { type: Number, required: true },
        menuMealDescription: { type: String, required: true },
        menuMealImage: { type: String, required: true },
        menuMealAllergens: [{type: ObjectId, ref: 'MenuAllergenModel'}],
        menuMealCategories: [{type: ObjectId, ref: 'MenuCategoryModel'}],
    }
);
module.exports = mongoose.model('MenuMealModel', menuMeal);;