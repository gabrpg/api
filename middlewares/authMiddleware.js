const jwt = require('jsonwebtoken');

const isJwtValid = async (req, res, next) => {
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
    });
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