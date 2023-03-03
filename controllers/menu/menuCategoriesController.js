const MenuCategory = require('../../models/menu/menuCategoryModel');
const MenuMeals = require("../../models/menu/menuMealModel");
async function getAllCategories(req, res) {
    try {
        return res.status(200).json(await MenuCategory.find());
    }
    catch(e) {
        console.log(e);
        return res.status(400).json({error: "error when getting item"});
    }
}
async function deleteAllCategories(req, res) {
    try {
        await MenuCategory.deleteMany();
        return res.status(200).json();
    }
    catch(e) {
        console.log(e);
        return res.status(400).json({error: "error when deleting item"});
    }
}
async function createCategory(req, res) {
    try {
        let result = await MenuCategory.create({
            menuCategoryName: req.body.menuCategoryName,
            menuCategoryDescription: req.body.menuCategoryDescription,
        });
        return res.status(200).json(result);
    }
    catch(e) {
        console.log(e);
        return res.status(400).json({error: "error when creating item"});
    }
}
async function getCategory(req, res) {
    try {
        return res.status(200).json(await MenuCategory.findById(req.params._id));
    }
    catch(e) {
        console.log(e);
        return res.status(400).json({error: "error when getting item"});
    }
}
async function modifyCategory(req, res) {
    try {
        const filter = {_id: req.params._id};
        const update = {
            menuCategoryName: req.body.menuCategoryName,
            menuCategoryDescription: req.body.menuCategoryDescription,
        };
        let result = await MenuCategory.findOneAndUpdate(filter, update, { new: true });
        return res.status(200).json(result);
    }
    catch(e) {
        console.log(e);
        return res.status(400).json({error: "error when modifying item"});
    }

}
async function deleteCategory(req, res) {
    try {
        await MenuCategory.deleteOne({_id: req.params._id}).then(function (result) {
            if (result.deletedCount === 1)
                return res.status(200).json();
        });
    }
    catch(e) {
        console.log(e);
        return res.status(400).json({error: "error when deleting item"});
    }
}
module.exports = { getAllCategories, deleteAllCategories, getCategory, createCategory, modifyCategory, deleteCategory };