let express = require('express');
let usersController = require('../../controllers/users/usersController');
let accountsController = require('../../controllers/users/accountsController');
let router = express.Router();
const { isJwtValid, isManager, isAdmin, isVerified } = require('../../middlewares/authMiddleware');
router.route('/')
    .get(isJwtValid, isVerified, accountsController.getAllInfosByID)
    .put(isJwtValid, isVerified, accountsController.modifyAccount)
    .patch(isJwtValid, isVerified, accountsController.modifyPassword)
router.route('/delete')
    .post(isJwtValid, isVerified, accountsController.deleteAccount)
router.route('/payment-info')
    .post(accountsController.addPaymentInfo);
router.route('/payment-info/:id')
    .get(accountsController.getPaymentInfo);
router.route('/allergies/:id')
    .post(accountsController.replaceAllergies);
router.route('/addresses')
    .get(isJwtValid, isVerified, accountsController.getAllAddressesByID)
    .post(isJwtValid, isVerified, accountsController.addAddress)
router.route('/addresses/delete')
    .post(isJwtValid, isVerified, accountsController.removeAddress)
router.route('/cart')
    .post(isJwtValid, usersController.addToCart)
    .delete(isJwtValid, usersController.emptyCart)
    .put(isJwtValid, usersController.replaceCart);
router.route('/cart/:id')
    .get(usersController.getCart)
    .delete(usersController.emptyCart)
    .post(usersController.replaceCart);
module.exports = router;