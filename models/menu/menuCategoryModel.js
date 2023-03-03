const mongoose = require('mongoose');
const menuCategory = new mongoose.Schema(
    {
        menuCategoryName: { type: String, required: true, unique: true },
        menuCategoryDescription: { type: String, required: true },
    }
);
module.exports = mongoose.model('MenuCategoryModel', menuCategory);;