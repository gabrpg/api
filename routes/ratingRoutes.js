let express = require('express');
let router = express.Router();
let ratingController = require('../controllers/ratingController');
const { isJwtValid, isManager, isAdmin } = require('../middlewares/authMiddleware');

router.route('/rating')
    .get(ratingController.getMealRating)
    .post(ratingController.rateMeal);
router.route('/rating/user')
    .get(ratingController.getHistory);
router.route('/rating/meal')
    .get(ratingController.getOneRating);

module.exports = router;