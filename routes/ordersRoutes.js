let express = require('express');
let ordersController = require('../controllers/ordersController');
let router = express.Router();
const { isJwtValid, isManager, isAdmin } = require('../middlewares/authMiddleware');
router.route('/user/:id')
    .get(isJwtValid, ordersController.getUserOrders)
    .post(isJwtValid, ordersController.createOrder);
router.route('/store')
    .get(isJwtValid, isManager, ordersController.getStoreOrders);
router.route('/admin')
    .get(isJwtValid, isAdmin, ordersController.getAllOrders);
module.exports = router;