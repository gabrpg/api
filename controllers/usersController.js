const Users = require('../models/usersModel');
const ObjectId = require('mongodb').ObjectId;
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const fs = require("fs");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const os = require("os");

async function getOne(req, res) {
    try {
        Users.findOne({_id: new ObjectId(req.params.id || req.payload.id)}).select("-userPassword").exec((err, user) => {
            if (user && !err) {
                return res.json(user);
            }
            else {
                console.log(err);
                return res.sendStatus(403);
            }
        })
    }
    catch(e) {
        console.log(e);
        return res.status(400).json({error: "error when getting item"});
    }
}
async function getAllManagers(req, res) {
    await Users.find().select("-userPassword")
        .then(managers => {
            return res.status(200).json(managers.filter(x => x.userManager));
        })
        .catch( e => {
            console.log(e);
            return res.status(400).json(e);
        });
}

async function getCart(req, res) {
    await Users.findOne({_id: new ObjectId(req.params.id || req.payload.id)}).select("userCart -_id")
        .then(cart => {
            return res.status(200).json(cart);
        })
        .catch( e => {
            console.log(e);
            return res.status(400).json(e);
        });
}

async function addToCart(req, res) {
    Users.findOneAndUpdate({_id: new ObjectId(req.payload.id || req.params.id)}, {$push : {userCart: req.body }}).select("-userPassword").then(user => {
        return res.status(204).json(user);
    })
    .catch(error => {
        console.log(error);
        return res.sendStatus(500);
    })
}

async function emptyCart(req, res) {
    Users.findOneAndUpdate({_id: new ObjectId(req.params.id || req.payload.id)}, {userCart: []}).select("-userPassword").then(user => {
        return res.status(204).json(user);
    })
    .catch(e => {
        console.log(e);
        return res.sendStatus(500).json(e);
    })
}

async function replaceCart(req, res) {
    Users.findOneAndUpdate({_id: new ObjectId(req.params.id)}, {userCart: req.body}).select("-userPassword").then(user => {
        return res.status(200).json(user);
    })
    .catch(e => {
        console.log(e);
        return res.sendStatus(500);
    })
}


function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

function sendVerificationLink(message) {

    const transporter = nodemailer.createTransport({
        host:'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: process.env.AUTH_USERNAME,
            pass: process.env.AUTH_PASSWORD
        },
        tls: {
            minVersion: 'TLSv1',
            rejectUnauthorized: false,
        },
    });

    transporter.sendMail(message, function(err, info){
        if (err) {
            console.log('Email error: ' + err);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

async function verifyEmailToken(req, res) {
    try {
        await Users.findOneAndUpdate({userEmailToken: req.params.token}, {userEmailVerified: true, userEmailToken: null}).exec(async(err, data) => {
            if(err || !data){
                if(err){
                    console.log(err);
                }
                return res.sendStatus(401);
            }
            if(data) {
                await setupPayload(req, res, {id: data._id, username: data.userName, isAdmin: data.userAdmin, isManager: data.userManager, isVerified: true});
                return res.sendStatus(200);
            }
        });
    } catch(err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

async function verifyPasswordToken(req, res) {
    try {
        await clearCookies(req, res);

        await Users.findOne({userPasswordToken: req.params.token}).exec((err, data) => {
            if(err || !data){
                if(err){
                    console.log(err);
                }
                return res.sendStatus(401);
            }
            if (data) {
                return res.sendStatus(200);
            }
        });
    } catch(err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

async function modifyPasswordAfterVerification(req, res){
    try {
        await Users.findOne({userPasswordToken: req.body.userPasswordToken}).exec( async (err, data) => {
            if(err || !data){
                if(err){
                    console.log(err);
                }
                return res.sendStatus(401);
            }

            if(data){
                data.userPasswordToken = undefined;
                data.userPassword = bcrypt.hashSync(req.body.userPassword, 10);
                await data.save().then(() => {
                    return res.sendStatus(201);
                })
                .catch(err => {
                    console.log(err);
                    return res.sendStatus(401);
                });
            }
        });
    } catch(err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

async function newVerficationToken(req, res) {
    try {
        await Users.findOne({_id: new ObjectId(req.cookies['SESSION_INFO'].id)}).exec(async (err, data) => {
            if(err || !data){
                if(err){
                    console.log(err);
                }
                return res.sendStatus(401);
            }

            if(data) {
                data.userEmailToken = generateToken();
                await data.save().then(() => {
                    sendVerificationLink({
                        from: process.env.USERNAME,
                        to: data.userEmail,
                        subject: 'Verifier votre addresse courriel',
                        html: `Merci de nous rejoindre et ainsi cliquer <a href="${process.env.ONLINE+/verify-email/+data.userEmailToken}"><strong>ici</strong></a> afin de vérifier votre adresse courriel. Merci de votre confiance`
                    });
                    return res.sendStatus(201);
                })
                .catch(err => {
                    console.log(err);
                    return res.sendStatus(401);
                });
            }
        });
    } catch(err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

async function newPassword(req, res){
    try {
        await Users.findOne({userEmail: req.body.userEmail}).exec(async (err, data)=> {
            if(err || !data){
                if(err){
                    console.log(err);
                }
                return res.sendStatus(401);
            }

            if(data){
                data.userPasswordToken = generateToken();
                await data.save().then(() => {
                    sendVerificationLink({
                        from: process.env.USERNAME,
                        to: data.userEmail,
                        subject: 'Nouveau mot de passe!',
                        html: `Merci de cliquer <a href="${process.env.ONLINE+/verify-password/+data.userPasswordToken}"><strong>ici</strong></a> afin de vous créer un nouveau mot de passe. Merci de votre confiance`
                    });
                    return res.sendStatus(201);
                })
                .catch(err => {
                    console.log(err);
                    return res.sendStatus(401);
                });
            }
        });
    }catch(err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

async function register(req, res) {
    try {
        await Users.findOne({userEmail: req.body.userEmail}).exec(async (err, data) => {
            if(err || data){
                if(err){
                    console.log(err);
                }
                return res.sendStatus(401);
            }

            if (!data) {
                let user = new Users(req.body);
                user.userPassword = bcrypt.hashSync(req.body.userPassword, 10);
                user.userEmailToken = generateToken();
                await user.save().then(() => {
                    sendVerificationLink({
                        from: process.env.USERNAME,
                        to: req.body.userEmail,
                        subject: 'Verifier votre addresse courriel',
                        html: `Merci de nous rejoindre et ainsi cliquer <a href="${process.env.ONLINE+/verify-email/+user.userEmailToken}"><strong>ici</strong></a> afin de vérifier votre adresse courriel. Merci de votre confiance`
                    });
                    return res.sendStatus(201);
                })
                .catch(err => {
                    console.log(err);
                    return res.sendStatus(401);
                });
            }
        });
    } catch(err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

async function login(req, res){
    try {
        await Users.findOne({userEmail: req.body.userEmail}).exec(async(err,data)=> {
            if(err || !data){
                if(err){
                    console.log(err);
                }
                return res.sendStatus(401);
            }

            if (data){
                if(bcrypt.compareSync(req.body.userPassword, data.userPassword)){
                    await setupPayload(req, res, {id: data._id, isAdmin: data.userAdmin, isManager: data.userManager, isVerified: data.userEmailVerified});
                    return res.sendStatus(201);
                }
            }
        });
    } catch(err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

function setEnvValue(key, value) {
    const data = fs.readFileSync(".env", "utf8").split(os.EOL);
    const target = data.indexOf(data.find((line) => {
        return line.match(new RegExp(key));
    }));

    data.splice(target, 1, `${key}=${value}`);
    fs.writeFileSync(".env", data.join(os.EOL));
}

async function setupPayload(req, res, payload) {
    let newKey = generateToken();
    console.log(newKey);
    let jwtToken = jwt.sign(payload, newKey, {expiresIn: '2h'});
    await setEnvValue('KEY', newKey);

    res.cookie("SESSIONID", jwtToken, {httpOnly: true});
    res.cookie("SESSION_INFO", payload);
}

function logout(req, res) {
    res.clearCookie('SESSIONID');
    res.clearCookie('SESSION_INFO');
    return res.sendStatus(204);
}

async function clearCookies(req , res) {
    res.clearCookie('SESSIONID');
    res.clearCookie('SESSION_INFO');
}

async function googleLogin(req, res){
    let { email, idToken } = req.body;
    const sameEmail = await Users.find({userEmail: email}).exec();
    if (sameEmail.length > 0) {
        if (sameEmail[0].googleAuth === '') {
            sameEmail[0].googleAuth = idToken;
            await sameEmail[0].save();
        }
        await setupPayload(req, res, {id: sameEmail[0]._id, isAdmin: sameEmail[0].userAdmin, isManager: sameEmail[0].userManager, isVerified: sameEmail[0].userEmailVerified});
        return res.status(200).json({ message: sameEmail });
    }
    const user = new Users({
        userEmail : email,
        userEmailVerified : true,
        userPassword : bcrypt.hashSync(generateToken(), 10),
        userManager : false,
        userAdmin : false,
        userAllergenIds: [],
        userCart : [],
        userEmailToken : '',
        googleAuth : idToken,
    });
    user.save().then(async () => {
        const newUser = await Users.findOne({userEmail: email}).exec();
        await setupPayload(req, res, {id: newUser._id, isAdmin: newUser.userAdmin, isManager: newUser.userManager, isVerified: newUser.userEmailVerified});
        return res.status(200).json({message: user});
    })
        .catch(e => {
            return res.status(500).json(e)
        });
}

module.exports = { getOne, getAllManagers, register, login, logout, getCart, addToCart, emptyCart, replaceCart, verifyEmailToken, newVerficationToken, newPassword, verifyPasswordToken, modifyPasswordAfterVerification, googleLogin };