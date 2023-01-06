const Product = require('../models/product')
const express = require('express');
const router = express.Router();

//http://localhost:3000/api/v1/products GET
router.get(`/`, async (req, res) => {
    const products = await Product.find();

    if(!products || products.length <= 0) {
        res.status(201).json({
            status: false,
            data: [],
            code: 200,
            message: "Empty Data !"
        });
    }

    res.send(products);
    // products.then(allProd  => {
    //     res.status(201).json({
    //            status: true,
    //            data: allProd,
    //            code: 201,
    //            message: "Products is load succesful !"
    //        });

    // })
})

//http://localhost:3000/api/v1/products  POST
router.post(`/`, (req, res) => {
    const product = new Product({
        id: req.body.id,
        name: req.body.name,
        image: req.body.image,
        countInStock: req.body.countInStock
    });

    product.save().then((newProduct => {
        res.status(201).json({
            status: true,
            data: newProduct,
            code: 200,
            message: "Product is create succesful !"
        });
    })).catch((err) => {
        res.status(500).json({
            status: false,
            data: err,
            code: 500,
            message: "Something when wrongs !"
        })
    })


});

module.exports = router;