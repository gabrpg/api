const StoresModel = require('../models/storesModel');
const {ObjectId} = require("mongodb");

async function getAllStores(req, res) {
    return res.status(200).json(await StoresModel.find());
}

async function getOne(req, res) {
    try {

        if(req.params._id) {
            return res.status(200).json(await StoresModel.findById(req.params._id));
        } else {
            return res.status(400).json({error: "error: no store ID given"});
        }

    } catch(e) {
        return res.status(400).json({error: "error when getting store"});
    }
}

async function getManagerStores(req, res) {
    StoresModel.find({storeManagerId: new ObjectId(req.payload.id)}).exec((err, stores) => {
        if (err) {
            console.log(err);
            return res.status(400);
        }
        else {
            return res.json(stores);
        }
    })
}

async function createStore(req, res) {
    let hours = req.body.storeBusinessHours;
    let manager = req.body.storeManagerId;

    if(manager) {
         manager = new ObjectId(manager[0]);
    } else {
        manager = null;
    }

    hours.forEach(item => {
        item._id = new ObjectId();
    });

    await StoresModel.create({
        storeName: req.body.storeName,
        storeDescription: req.body.storeDescription,
        storeAddress: req.body.storeAddress,
        storePhone: req.body.storePhone,
        storeDailyCost: req.body.storeDailyCost,
        storeBusinessHours: hours,
        storeMenu: req.body.storeMenu,
        storeImage: req.body.storeImage,
        storeManagerId: manager,
        storeLatitude: req.body.storeLatitude,
        storeLongitude: req.body.storeLongitude

    }).then(() => {
        return res.status(200).json({success: "success"});
    })
    .catch( err => {
        console.log(err);
        return res.status(400).json(err)
    });
}

async function updateStore(req, res) {

    const filter = {_id: req.body._id};

    let manager = req.body.storeManagerId;

    if(manager) {
        manager = new ObjectId(manager);
    } else {
        manager = null;
    }

    const update = {
        storeName: req.body.storeName,
        storeDescription: req.body.storeDescription,
        storeAddress: req.body.storeAddress,
        storePhone: req.body.storePhone,
        storeDailyCost: req.body.storeDailyCost,
        storeBusinessHours: req.body.storeBusinessHours,
        storeMenu: req.body.storeMenu,
        storeImage: req.body.storeImage,
        storeManagerId: manager,
        storeLatitude: req.body.storeLatitude,
        storeLongitude: req.body.storeLongitude
    };

    let result = await StoresModel.findOneAndUpdate(filter, update, { new: true })
        .then(() => {
            return res.status(200).json("ok");
        })
        .catch( err => {
            console.log(err);
            return res.status(400).json(err)
        });

}

async function deleteStore(req, res) {

    await StoresModel.deleteOne({_id: req.params._id})
        .then(() => {
            return res.status(200).json({success: "success"});
        })
        .catch( err => {
            console.log(err);
            return res.status(400).json(err)
        });
}

async function deleteAllStores(req, res) {

    try {
        await StoresModel.deleteMany();
        return res.status(200).json();
    } catch(e) {
        console.log(e);
        return res.status(400).json({error: "Erreur lors de la suppression des succursales"});
    }
}

module.exports = { getAllStores, getOne, getManagerStores, updateStore, createStore, deleteStore, deleteAllStores };