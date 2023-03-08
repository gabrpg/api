const Orders = require('../models/ordersModel');
const CartMeal = require('../models/menu/menuMealModel')
const cartModel = require("../models/cartsModel");
const ObjectId = require('mongodb').ObjectId;

async function getAllOrders(req, res) {
    Orders.find().exec((err, orders) => {
        if (err) {
            console.log(err);
            return res.status(400);
        }
        else {
            return res.json(orders);
        }
    })
}

async function getUserOrders(req, res) {
    Orders.find({orderUserId: req.payload.id}).exec((err, orders) => {
        if (err) {
            console.log(err);
            return res.status(400);
        }
        else {
            console.log(orders)
            return res.json(orders);
        }
    })
}

async function getUserOrdersById(req, res) {
    Orders.find({orderUserId: req.params.id}).exec((err, orders) => {
        if (err) {
            console.log(err);
            return res.status(400);
        }
        else {
            console.log(orders)
            return res.json(orders);
        }
    })
}

async function getStoreOrders(req, res) {
    Orders.find({orderStoreId: req.body.store}).exec((err, orders) => {
        if (err) {
            console.log(err);
            return res.status(400);
        }
        else {
            return res.json(orders);
        }
    })
}

async function createOrder(req, res) {
    await Orders.create({
        orderDate: req.body.date,
        orderTotal: req.body.total,
        orderMeals: req.body.meals,
        orderUserId: new ObjectId(req.body.id),
    }).then(function (result) {
        return res.status(200).json(result);
    });
}

async function createOrderById(req, res) {
    await Orders.create({
        orderDate: req.body.date,
        orderTotal: req.body.total,
        orderMeals: req.body.meals,
        orderUserId: new ObjectId(req.params.id),
    }).then(function (result) {
        return res.status(200).json(result);
    });
}

module.exports = { getAllOrders, getUserOrdersById, getStoreOrders, getUserOrders, createOrder, createOrderById };