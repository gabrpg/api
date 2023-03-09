let express = require('express');
let router = express.Router();
const { isJwtValid, isManager, isAdmin } = require('../middlewares/authMiddleware');
const menuMealsController = require("../controllers/menu/menuMealsController");
const menuCategoriesController = require("../controllers/menu/menuCategoriesController");
const menuAllergensController = require("../controllers/menu/menuAllergensController");

router.route('/meals').get(menuMealsController.getAllMeals).delete(isJwtValid, isAdmin, menuMealsController.deleteAllMeals).post(isJwtValid, isAdmin,menuMealsController.createMeal);
router.route('/meals/:_id')
    .get(menuMealsController.getMeal)
    .put(isJwtValid, isAdmin, menuMealsController.modifyMeal)
    .delete(isJwtValid, isAdmin, menuMealsController.deleteMeal);
router.route('/categories').get(menuCategoriesController.getAllCategories).delete(isJwtValid, isAdmin, menuCategoriesController.deleteAllCategories).post(isJwtValid, isAdmin, menuCategoriesController.createCategory);
router.route('/categories/:_id')
    .get(menuCategoriesController.getCategory)
    .put(isJwtValid, isAdmin,menuCategoriesController.modifyCategory)
    .delete(isJwtValid, isAdmin,menuCategoriesController.deleteCategory);
router.route('/allergens').get(menuAllergensController.getAllAllergens).delete(isJwtValid, isAdmin, menuAllergensController.deleteAllAllergens).post(isJwtValid, isAdmin, menuAllergensController.createAllergen);
router.route('/allergens/:_id')
    .get(menuAllergensController.getAllergen)
    .put(isJwtValid, isAdmin,menuAllergensController.modifyAllergen)
    .delete(isJwtValid, isAdmin,menuAllergensController.deleteAllergen);
router.route('/mealsbycategory').get(menuMealsController.getMealsByCategory);
module.exports = router;