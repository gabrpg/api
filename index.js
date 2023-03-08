const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use((err, req, res, next) => {
    if (err) {
        return res.status(400).json({error: "invalid json"});
    } else {
        next()
    }
})

const PORT = process.env.PORT || 3000;

mongoose.set('strictQuery', false);
mongoose.connect(process.env.DB_CONNECT).then(()=> console.log('Connected to DB'),  { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/menu', require("./routes/menuRoutes"));
app.use('/stores', require('./routes/storesRoutes'));
app.use('/order', require('./routes/ordersRoutes'));
app.use('/accounts', require('./routes/accountsRoutes'));
app.use('/users', require('./routes/usersRoutes'));
app.use('/images', require('./routes/imagesRoutes'));
app.use('/stats', require('./routes/StatsRoute'));
app.use('/rating', require('./routes/ratingRoutes'));
app.use('/mobile', require('./routes/mobileRoutes'));
app.use('/images', express.static('./images'));


app.listen(PORT, ()=> console.log('Listening on PORT 3000'));

 
