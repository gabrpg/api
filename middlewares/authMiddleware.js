const jwt = require('jsonwebtoken');
const Users = require('../models/users/usersModel');
const {ObjectId} = require("mongodb");
const isJwtValid = async (req, res, next) => {
    let token = req.cookies['SESSIONID'];

    if(token == null) {
        return res.sendStatus(401);
    }

    try {
        await Users.findOne({_id: new ObjectId(req.cookies['SESSION_INFO'].id)}).exec(async (err, data) => {
            if(err || !data){
                if(err){
                    console.log(err);
                }
                return res.sendStatus(401);
            }

            if(data) {
                jwt.verify(token, data.userToken, (err, payload) => {
                    if(err) {
                        return res.sendStatus(401);
                    }
                    req.payload = payload;
                    next();
                })
            }
        });
    } catch(err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

const isAdmin = async (req, res, next) => {
    if (req.payload.isAdmin === undefined || !req.payload.isAdmin)
        return res.sendStatus(401);

    next();
}

const isVerified = async (req, res, next) => {
    if (req.payload.isVerified === undefined || !req.payload.isVerified)
        return res.sendStatus(401);

    next();
}

const isAuthNotEmpty = (req, res, next) => {
    if (req.body.userEmail === '' || req.body.userPassword === '')
        return res.sendStatus(401);
    next();
}

const isEmailNotEmpty = (req, res, next) => {
    if (req.body.userEmail === '')
        return res.sendStatus(401);
    next();
}

const isManager = (req, res, next) => {
    if (req.payload.isManager === undefined || !req.payload.isManager)
        return res.sendStatus(401);

    next();
}

const isAdminOrManager = (req, res, next) => {
    if ((req.payload.isManager === undefined || !req.payload.isManager) && (req.payload.isAdmin === undefined || !req.payload.isAdmin))
        return res.sendStatus(401);

    next();
}

module.exports = {
    isJwtValid,
    isAdmin,
    isManager,
    isAdminOrManager,
    isVerified,
    isAuthNotEmpty,
    isEmailNotEmpty,
}