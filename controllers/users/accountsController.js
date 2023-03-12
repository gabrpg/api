const Address = require('../../models/crud/crud-user/address');
const Users = require("../../models/users/usersModel");
const PaymentInfo = require("../../models/crud/crud-user/paymentInfosModel");
const ObjectId = require('mongodb').ObjectId;
const usersController = require('./usersController')
const bcrypt = require("bcrypt");


async function getAllAddressesByID(req, res) {
    await Address.find({userId: new ObjectId(req.cookies['SESSION_INFO'].id)}).select("-userPassword").exec((err, data) => {
        if(data && !err){
            return res.json(data);
        } else {
            console.log(err);
            return res.sendStatus(401);
        }
    });
}

async function getAllInfosByID(req, res) {
   await Users.findOne({_id: new ObjectId(req.cookies['SESSION_INFO'].id)}).select("-userPassword").exec((err, user) => {
        if (user && !err) {
            return res.json(user);
        }
        else {
            console.log(err);
            return res.sendStatus(401);
        }
    })
}

async function addPaymentInfo(req, res) {
    let paymentInfo = new PaymentInfo(req.body);

    const check = { paymentInfoUserId: new ObjectId(paymentInfo.paymentInfoUserId) };
    const update = { $set: { paymentInfoCardNumber: paymentInfo.paymentInfoCardNumber,
                             paymentInfoCVV: paymentInfo.paymentInfoCVV,
                             paymentInfoExpiryMonth: paymentInfo.paymentInfoExpiryMonth,
                             paymentInfoExpiryYear: paymentInfo.paymentInfoExpiryYear,
                             paymentInfoUserId: paymentInfo.paymentInfoUserId }};
    const options = { upsert: true };

    await PaymentInfo.updateOne(check, update, options).then(() => {
        return res.sendStatus(201);
    })
    .catch(err => {
        console.log(err);
        return res.status(500);
    });
}

async function getPaymentInfo(req, res) {
    await PaymentInfo.findOne({paymentInfoUserId: new ObjectId(req.params.id)}).then(infos => {
        return res.status(200).json(infos);
    })
    .catch(err => {
        console.log(err);
        return res.status(500);
    });
}

async function replaceAllergies(req, res) {
    let allergies = req.body;

    const check = { _id: new ObjectId(req.params.id) };
    const update = { $set: { userAllergenIds: allergies } };

    await Users.updateOne(check, update).then(() => {
        return res.sendStatus(201);
    })
    .catch(err => {
        console.log(err);
        return res.status(500);
    });
}

async function addAddress(req, res) {
    try {
        let address = new Address(req.body);
        address.userId = new ObjectId(req.cookies['SESSION_INFO'].id);
        await address.save().then(() => {
            return res.sendStatus(201);
        })
            .catch(err => {
                console.log(err);
                return res.sendStatus(401);
            });
    } catch (err) {
        console.log(err);
        return res.sendStatus(501);
    }
}


async function removeAddress(req, res) {
    try {
        await Address.deleteOne({_id: new ObjectId(req.body._id)}).exec((err) => {
            if(err) {
                console.log(err);
                res.sendStatus(401);
            }
            return res.status(201);
        });
    } catch (err) {
        console.log(err);
        return res.status(500);
    }
}

async function modifyAccount(req, res){
    try {
       await Users.findOne({userEmail: req.body.userEmail}).exec( async (err,data) => {
           if(err){
               console.log(err);
               return res.sendStatus(401);
           }

            if(data){
                if(req.cookies['SESSION_INFO'].id !== data._id.toString()){
                    return res.sendStatus(401);
                }
            }

            if(!data || req.cookies['SESSION_INFO'].id === data._id.toString()){
                try {
                    await Users.findOne({_id: new ObjectId(req.cookies['SESSION_INFO'].id)}).exec(async (err,data) => {
                        if(err){
                            console.log(err);
                            return res.sendStatus(401);
                        }

                        data.userRealName = req.body.userRealName;
                        data.userLastName = req.body.userLastName;
                        data.userPhoneNumber = req.body.userPhoneNumber;

                        await data.save().then(() => {
                            return res.sendStatus(204);
                        })
                            .catch(() => {
                                return res.sendStatus(401)
                            });
                    });
                } catch(err) {
                    console.log(err);
                    return res.sendStatus(500)
                }
            }
       });
    } catch (err) {
        console.log(err);
        return res.sendStatus(500)
    }
}

async function deleteAccount(req, res) {
    try {
        await Users.deleteOne({ _id: new ObjectId(req.body._id) }).exec(async (err) =>{
            if(err){
                console.log(err);
                return res.sendStatus(401);
            }
            try {
                await Address.deleteMany({ userId: new ObjectId(req.body._id) }).exec(async(err) => {
                    if(err){
                        console.log(err);
                        return res.sendStatus(401);
                    }
                    await usersController.logout(req, res);
                });
            }catch(err) {
                console.log(err);
                return res.sendStatus(500);
            }
        });
    } catch(err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

async function modifyPassword(req, res){
    try {
        await Users.findOne({_id: new ObjectId(req.cookies['SESSION_INFO'].id)}).exec( async (err,data) => {
            if(err){
                console.log(err);
                return res.sendStatus(401);
            }

            if(bcrypt.compareSync(req.body.oldPassword, data.userPassword)){
                data.userPassword = bcrypt.hashSync(req.body.userPassword, 10);
                await data.save().then(()=>{
                    return res.sendStatus(201);
                });
            } else if (!bcrypt.compareSync(req.body.oldPassword, data.userPassword)) {
                return res.sendStatus(419);
            } else {
                return res.sendStatus(401);
            }
        });
    }catch(err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

module.exports = { addPaymentInfo, getPaymentInfo, replaceAllergies, addAddress, getAllAddressesByID, removeAddress, getAllInfosByID, modifyAccount, deleteAccount, modifyPassword };