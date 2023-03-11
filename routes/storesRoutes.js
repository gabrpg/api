let express = require('express');
let storesController = require('../controllers/storesController');
let router = express.Router();
const { isJwtValid, isAdminOrManager, isAdmin, isManager } = require('../middlewares/authMiddleware');
router.route('/')
    .get(storesController.getAllStores)
    .post(isJwtValid, isAdmin,storesController.createStore)
    .put(isJwtValid, isAdminOrManager,storesController.updateStore)
    .delete(isJwtValid, isAdmin, storesController.deleteAllStores)
router.route('/manager')
    .get(isJwtValid, isManager, storesController.getManagerStores);
router.route('/:_id')
    .get(storesController.getOne)
    .delete(isJwtValid, isAdmin,storesController.deleteStore);
module.exports = router;