let express = require('express');
let usersController = require('../controllers/usersController');
let accountsController = require('../controllers/accountsController');
let router = express.Router();
const { isJwtValid, isManager, isAdmin, isVerified } = require('../middlewares/authMiddleware');
router.route('/')
    .get(isJwtValid, isVerified, accountsController.getAllInfosByID)
    .put(isJwtValid, isVerified, accountsController.modifyAccount)
    .patch(isJwtValid, isVerified, accountsController.modifyPassword)
router.route('/delete')
    .post(isJwtValid, isVerified, accountsController.deleteAccount)
router.route('/addresses')
    .get(isJwtValid, isVerified, accountsController.getAllAddressesByID)
    .post(isJwtValid, isVerified, accountsController.addAddress)
router.route('/addresses:id')
    .delete(isJwtValid, isVerified, accountsController.removeAddress)
router.route('/cart')
    .post(isJwtValid, usersController.addToCart)
    .delete(isJwtValid, usersController.emptyCart)
    .put(isJwtValid, usersController.replaceCart);
router.route('/cart/:id')
    .get(usersController.getCart)
module.exports = router;