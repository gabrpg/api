const ImageModel = require('../models/imageModel');
async function createImage(req, res) {
    try {
        let obj = {
            imageName: req.body.imageName,
            imageDescription: req.body.imageDescription,
            imagePath: `api/${req.file.path.replace(/\\/g, "/")}`,
        }
        return res.status(200).json(await ImageModel.create(obj));
    }
    catch (e) {
        console.log(e);
        return res.status(400).json({error: "error when creating image"});
    }
}
async function deleteImage(req, res) {
    try {
        await ImageModel.deleteOne({_id: req.params._id}).then(function (result) {
            if (result.deletedCount === 1)
                return res.status(200).json();
            else
                return res.status(400).json({error: "image not found"});
        });
    }
    catch (e) {
        console.log(e);
        return res.status(400).json({error: "error when deleting image"});
    }
}
module.exports = { createImage, deleteImage };