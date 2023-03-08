let express = require('express');
let ordersController = require('../controllers/ordersController');
let router = express.Router();

router.route('/user')
    .get(ordersController.getUserOrders)
    .post(ordersController.createOrder);
module.exports = router;