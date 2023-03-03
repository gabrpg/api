const mongoose = require('mongoose');
const MenuMealModel = require('./menu/menuMealModel')


const storeBusinessHours = new mongoose.Schema(
    {
        storeBusinessHoursDay: { 
            type: String, 
            enum: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"],
            required: true 
        },
        storeBusinessHoursOpenHour : { type: Number, min: 0, max: 23, required: true },
        storeBusinessHoursCloseHour : { type: Number, min: 0, max: 23, required: true },
        storeBusinessHoursOpenMinute : { type: Number, min: 0, max: 59, required: true },
        storeBusinessHoursCloseMinute : { type: Number, min: 0, max: 59, required: true },
        storeBusinessHoursDayOff: { type: Boolean, required: true}
    }
);

const stores = new mongoose.Schema(
    {
        storeName: { type: String, required: true },
        storeDescription: {type: String, required: false},
        storeAddress: { type: String, required: true },
        storePhone: { type: String, required: true },
        storeDailyCost: { type: Number, required: false },
        storeBusinessHours: { type: [storeBusinessHours], required: false},
        storeMenu: {type: [MenuMealModel.schema], required: false},
        storeImage: {type: String, required: false},
        storeManagerId: {type: mongoose.Schema.Types.ObjectId, ref: 'UsersModel', required: false},
        storeLatitude: {type: String, required: false},
        storeLongitude: {type: String, required: false}
    }
);

module.exports = mongoose.model('StoresModel', stores);