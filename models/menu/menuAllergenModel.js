const mongoose = require('mongoose');
const menuAllergen = new mongoose.Schema(
    {
        menuAllergenName: { type: String, required: true, unique: true },
        menuAllergenImage: { type: String, required: true },
    }
);
module.exports = mongoose.model('MenuAllergenModel', menuAllergen);