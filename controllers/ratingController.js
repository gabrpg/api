const RatingMeal = require('../models/ratingModel');
const Users = require("../models/usersModel");


async function rateMeal(req, res){
        const sameRating = await RatingMeal.find({meal: req.body.meal}).exec();
        if(sameRating.length > 0){
            sameRating[0].MealRating = req.body.MealRating;
            sameRating[0].comment = req.body.comment;

            await sameRating[0].save().then(() => {
                return res.sendStatus(201);
            }).catch(err => {
                return res.sendStatus(401);
            });
        }else{
            let rating = await RatingMeal.create({
                MealRating: req.body.MealRating,
                comment: req.body.comment,
                meal: req.body.meal,
                user: req.body.user,
            });
            await rating.save().then(() => {
                return res.sendStatus(201);
            }).catch(err =>{
                return res.sendStatus(401);
            })
        }
}

async function getHistory(req, res){
    try {
        await RatingMeal.find({user: req.params.id}).exec( (err, data) => {
            return res.json(data);
        })
    }catch(e) {
        console.log(e);
        return res.status(400).json({error: "error when getting rating history"});
    }
}

async function getOneRating(req, res){
    try {
        await RatingMeal.find({meal: req.params.id}).exec( (err, data) => {
            return res.json(data);
        })
    }catch(e) {
        console.log(e);
        return res.status(400).json({error: "error when getting rating history"});
    }
}

module.exports = {rateMeal, getHistory, getOneRating};