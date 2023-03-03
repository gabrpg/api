let express = require('express');
let storesController = require('../controllers/storesController');
let router = express.Router();
const { isJwtValid, isManager, isAdmin } = require('../middlewares/authMiddleware');
router.route('/')
    .get(storesController.getAllStores)
    .post(isJwtValid, isAdmin,storesController.createStore)
    .put(isJwtValid, isAdmin,storesController.updateStore)
    .delete(isJwtValid, isAdmin, storesController.deleteAllStores)
router.route('/:_id')
    .get(storesController.getOne)
    .delete(isJwtValid, isAdmin,storesController.deleteStore);
module.exports = router;