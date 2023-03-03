const mongoose = require('mongoose');
const image = new mongoose.Schema(
    {
        imageName: String,
        imageDescription: String,
        imagePath: String,
    }
);
module.exports = mongoose.model('ImageModel', image);