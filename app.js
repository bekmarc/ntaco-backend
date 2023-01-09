const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const authJwt = require("./helpers/jwt");
const errorHandler = require("./helpers/error-handler");

require("dotenv/config");
const api = process.env.API_URL;

//Routes
const ProductRouter = require("./routers/products");
const CategoryRouter = require("./routers/categories");
const UserRouter = require("./routers/users");

// Cross Origin Allows
app.use(cors());
app.use("*", cors());

//Middlware
app.use(express.json());
app.use(morgan("tiny"));
app.use(authJwt());
app.use((err, req, res, next) => {
    if(err.name === 'UnauthorizedError'){
         res.status(401).json({
            status: false,
            code: 401,
            data:{err},
            message: "The User is not Authorized ! "
        })
    }
    if(err.name === 'ValidationError'){
         res.status(401).json({
            status: false,
            code: 401,
            data:{err},
            message: "The User is not Authorized !"
        })
    }

     res.status(401).json({
        status: false,
        code: 500,
        data:{err},
        message: "The User is not Authorized !"
    })

});

//Routers
app.use(`${api}/products`, ProductRouter);
app.use(`${api}/categories`, CategoryRouter);
app.use(`${api}/users`, UserRouter);

mongoose.set("strictQuery", false);
mongoose
  .connect(`${process.env.CONNECTING_MDB_STR}`)
  .then(() => {
    console.log("Database is Ready...");
  })
  .catch((err) => {
    console.log("err" + err);
  });

app.listen(3000, () => {
  console.log(api);
  console.log("isZooo, Server is Running to http://localhost:3000 !");
});
