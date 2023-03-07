let express = require('express');
let usersController = require('../controllers/usersController');
let router = express.Router();
const { isJwtValid, isManager, isAdmin, isAuthNotEmpty, isEmailNotEmpty} = require('../middlewares/authMiddleware');
router.route('/')
    .get(isJwtValid, usersController.getOne);
router.route('/register')
    .post(isAuthNotEmpty, usersController.register)
router.route('/login')
    .post(isAuthNotEmpty, usersController.login)
router.route('/logout')
    .post(usersController.logout)
router.route('/managers')
    .get(usersController.getAllManagers);
router.route('/:id')
    .get(usersController.getOne);
router.route('/verify-email/:token')
    .get(usersController.verifyEmailToken);
router.route('/verify-new')
    .post(isJwtValid, usersController.newVerficationToken)
router.route('/forgot-password')
    .post(isEmailNotEmpty, usersController.newPassword)
router.route('/verify-password/:token')
    .get(usersController.verifyPasswordToken)
router.route('/modify-password')
    .post(usersController.modifyPasswordAfterVerification)
router
    .route('/google')
    .post(usersController.googleLogin)
module.exports = router;