let express = require('express');
let router = express.Router();
let statsController = require('../controllers/statisticController');
const { isJwtValid, isManager, isAdmin } = require('../middlewares/authMiddleware');


router.route('/sales/:days')
    .get(isJwtValid, isAdmin, statsController.getSalesStats);

module.exports = router;