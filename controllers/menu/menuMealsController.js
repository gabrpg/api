const MenuMeals = require('../../models/menu/menuMealModel');
const MenuCategory = require("../../models/menu/menuCategoryModel");
async function getAllMeals(req, res) {
    try {
        return res.status(200).json(await MenuMeals.find().populate('menuMealAllergens menuMealCategories'));
    } catch (e) {
        console.log(e);
        return res.status(400).json({error: "error when getting item"});
    }
}
async function getMealsByCategory(req, res) {
    try {
        let meals = await MenuMeals.find().populate('menuMealAllergens menuMealCategories');
        const map = new Map();
        for (let i = 0; i < meals.count; i++) {
            for (let j = 0; j < meals[i].menuMealCategories.length; j++) {
                const key = meals[i].menuMealCategories[j].menuCategoryName;
                const collection = map.get(key);
                if (!collection) {
                    map.set(key, [meals[i]]);
                } else {
                    collection.push(meals[i]);
                }
            }
        }
        return res.status(200).json(JSON.stringify(Object.fromEntries(map)));
    } catch (e) {
        console.log(e);
        return res.status(400).json({error: "error when getting item"});
    }
}
async function deleteAllMeals(req, res) {
    try {
        await MenuMeals.deleteMany();
        return res.status(200).json();
    } catch(e) {
        console.log(e);
        return res.status(400).json({error: "error when deleting item"});
    }
}
async function createMeal(req, res) {
    try {
        let result = await MenuMeals.create({
            menuMealName: req.body.menuMealName,
            menuMealPrice: req.body.menuMealPrice,
            menuMealDescription: req.body.menuMealDescription,
            menuMealImage: req.body.menuMealImage,
            menuMealAllergens: req.body.menuMealAllergens,
            menuMealCategories: req.body.menuMealCategories,
        });
        result = await result.populate('menuMealAllergens menuMealCategories');
        return res.status(200).json(result);
    }
    catch(e) {
        console.log(e);
        return res.status(400).json({error: "error when creating item"});
    }
}
async function getMeal(req, res) {
    try {
        return res.status(200).json(await MenuMeals.findById(req.params._id).populate('menuMealAllergens').populate('menuMealCategories'));
    } catch(e) {
        console.log(e);
        return res.status(400).json({error: "error when getting item"});
    }
}
async function modifyMeal(req, res) {
    try {
        const filter = {_id: req.params._id};
        const update = {
            menuMealName: req.body.menuMealName,
            menuMealPrice: req.body.menuMealPrice,
            menuMealDescription: req.body.menuMealDescription,
            menuMealImage: req.body.menuMealImage,
            menuMealAllergens: req.body.menuMealAllergens,
            menuMealCategories: req.body.menuMealCategories,
        };
        let result = await MenuMeals.findOneAndUpdate(filter, update, { new: true }).populate('menuMealAllergens').populate('menuMealCategories');
        return res.status(200).json(result);
    }
    catch(e) {
        console.log(e);
        return res.status(400).json({error: "error when modifying item"});
    }
}
async function deleteMeal(req, res) {
    try {
        await MenuMeals.deleteOne({_id: req.params._id}).then(function (result) {
            if (result.deletedCount === 1)
                return res.status(200).json();
        });
    }
    catch(e) {
        console.log(e);
        return res.status(400).json({error: "error when deleting item"});
    }
}
module.exports = { getAllMeals, getMealsByCategory, deleteAllMeals, getMeal, createMeal, modifyMeal, deleteMeal };