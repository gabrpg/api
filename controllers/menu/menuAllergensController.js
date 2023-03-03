const MenuAllergens = require('../../models/menu/menuAllergenModel');
async function getAllAllergens(req, res) {
    try {
        return res.status(200).json(await MenuAllergens.find());
    }
    catch(e) {
        console.log(e);
        return res.status(400).json({error: "error when getting item"});
    }
}
async function deleteAllAllergens(req, res) {
    try {
        await MenuAllergens.deleteMany();
        return res.status(200).json();
    }
    catch(e) {
        console.log(e);
        return res.status(400).json({error: "error when deleting item"});
    }
}
async function createAllergen(req, res) {
    try {
        let result = await MenuAllergens.create({
            menuAllergenName: req.body.menuAllergenName,
            menuAllergenImage: req.body.menuAllergenImage,
        });
        return res.status(200).json(result);
    }
    catch(e) {
        console.log(e);
        return res.status(400).json({error: "error when creating item"});
    }
}
async function getAllergen(req, res) {
    try {
        return res.status(200).json(await MenuAllergens.findById(req.params._id));
    }
    catch(e) {
        console.log(e);
        return res.status(400).json({error: "error when getting item"});
    }
}
async function modifyAllergen(req, res) {
    try {
        const filter = {_id: req.params._id};
        const update = {
            menuAllergenName: req.body.menuAllergenName,
            menuAllergenImage: req.body.menuAllergenImage,
        };
        let result = await MenuAllergens.findOneAndUpdate(filter, update, { new: true });
        return res.status(200).json(result);
    }
    catch(e) {
        console.log(e);
        return res.status(400).json({error: "invalid json"});
    }
}
async function deleteAllergen(req, res) {
    try {
        await MenuAllergens.deleteOne({_id: req.params._id}).then(function (result) {
            if (result.deletedCount === 1)
                return res.status(200).json();
        });
    }
    catch(e) {
        console.log(e);
        return res.status(400).json({error: "error when deleting item"});
    }
}
module.exports = { getAllAllergens, deleteAllAllergens, getAllergen, createAllergen, modifyAllergen, deleteAllergen };