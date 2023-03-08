let express = require('express');
let ordersController = require('../controllers/ordersController');
let router = express.Router();

router.route('/order/user/:id')
    .get(ordersController.getUserOrders)
    .post(ordersController.createOrder);
module.exports = router;