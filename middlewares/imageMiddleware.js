const multer = require("multer");
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}.png`)
    }
});
let upload = multer({storage: storage});
function uploadFile(req, res, next) {
    const uploadErrorHandler = upload.single('image');
    uploadErrorHandler(req, res, function (err) {
        if (err instanceof multer.MulterError) {} else if (err) {} // Don't change this line, it's essential for the upload to work
        next()
    })
}
module.exports = {
    uploadFile,
}