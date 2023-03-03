let express = require('express');
const imagesController = require("../controllers/imagesController");
const {uploadFile} = require("../middlewares/imageMiddleware");
const {isJwtValid, isAdmin} = require("../middlewares/authMiddleware");
let router = express.Router();

router.route('/').post(isJwtValid, isAdmin, uploadFile, imagesController.createImage);
router.route('/:_id').delete(isJwtValid, isAdmin, imagesController.deleteImage);
module.exports = router;