const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const menuMeal = new mongoose.Schema(
    {
        menuMealName: { type: String, required: true },
        menuMealPrice: { type: Number, required: true },
        menuMealDescription: { type: String, required: true },
        menuMealImage: { type: String, required: true },
        menuMealRating: { type: Number, required: false, min: 0 },
        menuMealTotalRating: {type: Number, required: true,min:0, default: 0},
        menuMealAllergens: [{type: ObjectId, ref: 'MenuAllergenModel'}],
        menuMealCategories: [{type: ObjectId, ref: 'MenuCategoryModel'}],
    }
);
module.exports = mongoose.model('MenuMealModel', menuMeal);