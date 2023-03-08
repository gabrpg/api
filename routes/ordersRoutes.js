let express = require('express');
let ordersController = require('../controllers/ordersController');
let router = express.Router();
const { isJwtValid, isManager, isAdmin } = require('../middlewares/authMiddleware');
router.route('/user')
    .get(isJwtValid, ordersController.getUserOrders)
    .post(ordersController.createOrder);
router.route('/store')
    .get(isJwtValid, isManager, ordersController.getStoreOrders);
router.route('/admin')
    .get(isJwtValid, isAdmin, ordersController.getAllOrders);
module.exports = router;