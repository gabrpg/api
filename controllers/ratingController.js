const RatingMeal = require('../models/users/ratingModel');
const Users = require("../models/users/usersModel");
const Orders = require("../models/stores/ordersModel");


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
    RatingMeal.find({user: req.params.id}).exec((err, rating) => {
        if (err) {
            console.log(err);
            return res.status(400);
        }
        else {
            return res.json(rating);
        }
    })
}

async function getOneRating(req, res){
    RatingMeal.find({meal: req.params.id}).exec((err, rating) => {
        if (err) {
            console.log(err);
            return res.status(400);
        }
        else {
            return res.json(rating);
        }
    })
}

module.exports = {rateMeal, getHistory, getOneRating};