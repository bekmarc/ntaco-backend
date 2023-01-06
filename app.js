const express = require("express");
const app = express();
const morgan = require('morgan')
const mongoose = require("mongoose");
const cors = require('cors');

require('dotenv/config');
const api = process.env.API_URL

//Routes
const ProductRouter = require('./routers/products');


// Cross Origin Allows
app.use(cors());
app.use('*', cors());


//Middlware
app.use(express.json());
app.use(morgan('tiny'));

//Routers
app.use(`${api}/products`, ProductRouter);

mongoose.set('strictQuery',false);
mongoose.connect(`${process.env.CONNECTING_MDB_STR}`).then(() => {
    console.log("Database is Ready...");
}).catch((err) => {
    console.log("err"+err);
});

app.listen(3000, () => {
    console.log(api);
    console.log("isZooo, Server is Running to http://localhost:3000 !");
});