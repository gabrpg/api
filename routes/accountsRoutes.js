let express = require('express');
let usersController = require('../controllers/usersController');
let accountsController = require('../controllers/accountsController');
let router = express.Router();
const { isJwtValid, isManager, isAdmin, isVerified, checkUserIdentity } = require('../middlewares/authMiddleware');
router.route('/')
    .get(isJwtValid, isVerified, checkUserIdentity, accountsController.getAllInfosByID)
    .put(isJwtValid, isVerified, checkUserIdentity, accountsController.modifyAccount)
    .patch(isJwtValid, isVerified, checkUserIdentity, accountsController.modifyPassword)
router.route('/delete')
    .post(isJwtValid, isVerified, checkUserIdentity, accountsController.deleteAccount)
router.route('/addresses')
    .get(isJwtValid, isVerified, checkUserIdentity, accountsController.getAllAddressesByID)
    .post(isJwtValid, isVerified, checkUserIdentity, accountsController.addAddress)
router.route('/addresses:id')
    .delete(isJwtValid, isVerified, checkUserIdentity, accountsController.removeAddress)
router.route('/cart')
    .post(isJwtValid, usersController.addToCart)
    .delete(isJwtValid, usersController.emptyCart)
    .put(isJwtValid, usersController.replaceCart);
router.route('/cart/:id')
    .get(usersController.getCart)
    .delete(usersController.emptyCart);
module.exports = router;