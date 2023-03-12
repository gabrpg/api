const mongoose = require('mongoose');
const cartModel = require('./cartsModel');
const ObjectId = mongoose.Schema.Types.ObjectId;

const user = new mongoose.Schema(
    {
        userEmail: { type: String, required: true },
        userEmailToken : { type: String, required: false },
        userEmailVerified: { type: Boolean, required: false, default: false },
        userRealName: { type: String, required: false },
        userLastName: { type: String, required: false },
        userPhoneNumber: { type: String, required: false },
        userPassword: { type: String, required: true },
        userPasswordToken : { type: String, required: false },
        userManager: { type: Boolean, required: true, default: false},
        userAdmin: { type: Boolean, required: true, default: false },
        userCart: { type: [cartModel.schema], required: true, default: [] },
        userAllergenIds: [{ type: ObjectId, ref: 'MenuAllergenModel' , default: []}],
        googleAuth : {type: String, required: false, default : ''},
            userToken : { type: String, required: false, default : ''}
    }
);
module.exports = mongoose.model('UsersModel', user);