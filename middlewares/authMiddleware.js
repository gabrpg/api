const jwt = require('jsonwebtoken');
const Users = require('../models/usersModel');
const isJwtValid = (req, res, next) => {
    let token = req.cookies['SESSIONID'];

    if(token == null) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.KEY, (err, payload) => {
        if(err) {
            return res.sendStatus(401);
        }
        req.payload = payload;
        next();
    })
}

//TODO: middleware useless pour le moment
const checkUserIdentity = (req, res, next) => {
    if (!req.payload) {
        return res.status(401).json({ message: 'Vous devez être connecté pour effectuer cette action.' });
    }

    if (req.cookies['SESSION_INFO'].id !== req.payload.id) {
        return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à modifier les informations de cet utilisateur.' });
    }

    next();
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
module.exports = {
    isJwtValid,
    isAdmin,
    isManager,
    isVerified,
    checkUserIdentity,
    isAuthNotEmpty,
    isEmailNotEmpty,
}