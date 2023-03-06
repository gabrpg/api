let express = require('express');
let router = express.Router();
let ratingController = require('../controllers/ratingController');
const { isJwtValid, isManager, isAdmin } = require('../middlewares/authMiddleware');

router.route('/rating')
    .get(ratingController.getMealRating)
    .put(ratingController.getHistory)
    .post(ratingController.rateMeal)

module.exports = router;