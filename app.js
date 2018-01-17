const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

//Connection to MongoDB
mongoose.connect("mongodb://node-api:" + process.env.MONGO_ATLAS_DB_PW + "@node-api-shard-00-00-ti3yh.mongodb.net:27017,node-api-shard-00-01-ti3yh.mongodb.net:27017,node-api-shard-00-02-ti3yh.mongodb.net:27017/test?ssl=true&replicaSet=node-api-shard-0&authSource=admin", {
    useMongoClient: true
});

mongoose.Promise = global.Promise;

//Request Logger.
app.use(morgan('dev'));
//Body parser for the body content of the API.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//To fix the issues with CORS
// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//     if (req.method === 'OPTIONS') {
//         res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
//         return res.status(200).json({});
//     }
// });

//Routes that handles request.
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

//Error Handler
app.use((req, res, next) => {
    const error = new Error("Not Found.");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});


module.exports = app;