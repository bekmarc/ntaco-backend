const Product = require("../models/product").Product;
const Category = require("../models/category").Category;
const mongoose = require("mongoose");
const _ = require("lodash");

const express = require("express");
const router = express.Router();

//http://localhost:3000/api/v1/products GET
router.get(`/`, async (req, res) => {
  //http://localhost:3000/api/v1/products?categories=478551,58632  GET
  let categoriesFilter = {}
  if(req.query.categories){
    categoriesFilter = {category: req.query.categories.split(',')}
  }

  const products = await Product.find(categoriesFilter).populate("category");

  if (!products || products.length <= 0) {
    res.status(201).json({
      status: false,
      data: [],
      code: 200,
      message: "Empty Data !",
    });
  }

  res.send(products);
});

router.get(`/:id`, async (req, res) => {
  try {
    const productDetail = await Product.findById(req.params.id)
      .select("category -_id name")
      .populate("category");

    if (!productDetail) {
      throw new Error("The Product not find !");
    }

    res.status(201).json({
      status: true,
      data: productDetail,
      code: 200,
      message: "Product is find succesful !",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      data: error,
      code: 500,
      message: error.message,
    });
  }
});

router.put(`/:id`, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new Error("The ID is not a valid Product ID!");
    }
    const productUpdated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        images: req.body.images,
        brand: req.body.brand, 
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating, 
        numReviews: req.body.numReviews,  
        isFeatured: req.body.isFeatured,
        dateCreated: req.body.dateCreated,
      },
      { new: true }
    );

    if (!productUpdated) {
      throw new Error("The Product is not updated !");
    }

    res.status(201).json({
      status: true,
      data: productUpdated,
      code: 200,
      message: "Product is updated succesful !",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      data: error,
      code: 500,
      message: error.message,
    });
  }
});

//http://localhost:3000/api/v1/products  POST
router.post(`/`, async (req, res) => {
  try {
    const productCategory = await Category.findById(req.body.category);
    if (!productCategory) {
      throw new Error("The Category is not existed !");
    }

    let product = new Product({
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      images: req.body.images,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
      dateCreated: req.body.dateCreated,
    });
    product = await product.save();

    if (!product) {
      throw new Error("The Product is not created !");
    }

    res.status(201).json({
      status: true,
      data: product,
      code: 200,
      message: "The product is created succesful !",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      data: error,
      code: 500,
      message: error.message,
    });
  }
});

router.delete(`/:id`, async (req, res) => {
  const productDeleted = await Product.findByIdAndDelete(req.params.id);

  try {
    // if(!mongoose.isValidObjectId(req.params.id)){
    //     throw new Error('The Id of product is not valid ID !');
    // }
    if (_.isEmpty(productDeleted) === false) {
      res.status(201).json({
        status: true,
        data: productDeleted,
        code: 200,
        message: "Product is deleted succesful !",
      });
    } else {
      throw new Error("The Product cannot be deleted !");
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      data: error,
      code: 500,
      message: error.message,
    });
  }
});

router.get(`/get/count`, async (req, res) => {
  try {
    const productsCount = await Product.countDocuments();

    if (!productsCount) {
      throw new Error("The Product not find !");
    }

    res.status(201).json({
      status: true,
      data: productsCount,
      code: 200,
      message: "Product is count succesful !",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      data: error,
      code: 500,
      message: error.message,
    });
  }
});

router.get(`/get/featured/:count`, async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  try {
    const productsFeatured = await Product.find({ isFeatured: true }).limit(
      +count
    );

    if (!productsFeatured) {
      throw new Error("Empty Featured Product !");
    }

    res.status(201).json({
      status: true,
      data: productsFeatured,
      code: 200,
      message: "Return Featured Product succesful !",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      data: error,
      code: 500,
      message: error.message,
    });
  }
});

module.exports = router;
