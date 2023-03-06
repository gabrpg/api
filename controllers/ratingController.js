const RatingMeal = require('../models/ratingModel');
const Users = require("../models/usersModel");
const bcrypt = require("bcrypt");


async function rateMeal(req, res){
    try {
        let rating = await RatingMeal.create({
            MealRating: req.body.MealRating,
            menuMeal: req.body.menuMeal,
            user: req.body.user,
        });
        await rating.save().then(() => {
            return res.sendStatus(201);
        })
    }
    catch(e) {
        console.log(e);
        return res.status(400).json({error: "error when creating rating"});
    }
}

async function getHistory(req, res){
    try {
        await RatingMeal.find({user: req.body.user}).exec( (err, data) => {
            return res.json(data);
        })
    }catch(e) {
        console.log(e);
        return res.status(400).json({error: "error when getting rating history"});
    }
}

async function getMealRating(req, res){
    try {
        await RatingMeal.find({menuMeal: req.body.menuMeal}).exec( (err, data) => {
            return res.json(data);
        })
    }catch(e) {
        console.log(e);
        return res.status(400).json({error: "error when getting rating history"});
    }
}

module.exports = {rateMeal, getHistory, getMealRating};