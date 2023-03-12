const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const ratingMeal = new mongoose.Schema(
    {
        MealRating: { type: Number, required: false, min: 0 },
        comment: {type: String},
        meal: {type: ObjectId, ref: 'MenuMealModel'},
        user: {type: ObjectId, ref: 'usersModel'},
    }
);
module.exports = mongoose.model('ratingMeal', ratingMeal);