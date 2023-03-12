const Orders = require("../models/stores/ordersModel");
const MenuMeal = require("../models/menu/menuMealModel");
const Stats = require("../models/statsModel");
const Summary = require("../models/summaryModel");

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

function getSummary(req, res){

    let timePeriod = req.params.time;
    let iteration = 0;
    let timeDifference = 0;
    let arraySumary = [];

    switch(timePeriod) {
        case 'j':
            iteration = 7;
            timeDifference = 1;
            break;
        case 'h':
            iteration = 4;
            timeDifference = 7;
            break;
        case 'm':
            iteration = 12;
            timeDifference = 30;
            break;
        default:
            iteration = 10;
            timeDifference = 365;
    }

    Orders.find().exec((err, orders) => {
        if (err) {
            return res.status(400);
        }
        else {
            for(let i = 0; i < iteration; i++){
                let nbBuyer = 0;
                let sales = 0;
                let dateOne = new Date();
                let dateTwo = new Date();

                dateOne.setDate(dateOne.getDate() - timeDifference * (i + 1));
                dateTwo.setDate(dateTwo.getDate() - timeDifference * (i + 1) + timeDifference);

                orders.forEach(order =>{
                    if(order.orderDate.getTime() >= dateOne.getTime() && order.orderDate.getTime() <= dateTwo.getTime()) {
                        nbBuyer++;
                        sales += order.orderTotal;
                    }
                });
                let summary = new Summary({
                    nbBuyer: nbBuyer,
                    sales: sales,
                    startingDate: dateOne,
                    endingDate: dateTwo,
                });
                arraySumary.push(summary);
            }
        }
        return res.status(200).json(arraySumary);
    })
}


module.exports = { getSalesStats, getSummary };