const Orders = require("../models/ordersModel");
const MenuMeal = require("../models/menu/menuMealModel");
const Stats = require("../models/statsModel");

function getSalesStats(req, res){
    let days = req.params.days;
    let date = new Date();
    date.setDate(date.getDate()-days);

    const sales = new Map()
    let salesArray = []
    MenuMeal.find()
        .then(meals => {
            meals.forEach(meal=>{
                sales.set(meal.menuMealName, 0)
            });
            Orders.find().exec((err, orders) => {
                if (err) {
                    return res.status(400);
                }
                else {
                    orders.forEach(order =>{
                        if(order.orderDate.getTime() >= date.getTime()){
                            order.orderMeals.forEach(meal =>{
                                let name = meal.cartMeal.menuMealName
                                let price = meal.cartMeal.menuMealPrice
                                sales.set(name, sales.get(name) + price)
                            });
                        }
                    });
                }
                sales.forEach((values,keys)=>{
                    const obj = new Stats ({
                        name: keys,
                        sales: values,
                    })
                    salesArray.push(obj)
                })
                return res.status(200).json(salesArray);
            });
        })
        .catch( e => {
            return res.status(400);
        });
}


module.exports = { getSalesStats };