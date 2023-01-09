const User = require("../models/user").User;
const express = require("express");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const router = express.Router();
const _ = require("lodash");
const jwt = require("jsonwebtoken");

router.get(`/`, async (req, res) => {
  //http://localhost:3000/api/v1/products?categories=478551,58632  GET
  let usersFilter = {};
  if (req.query.name) {
    usersFilter = { name: req.query.name };
  }

  const users = await User.find(usersFilter);

  if (!users || users.length <= 0) {
    res.status(201).json({
      status: false,
      data: [],
      code: 200,
      message: "Empty Data !",
    });
  }

  res.send(users);
});

router.get(`/:id`, async (req, res) => {
  try {
    const userDetail = await User.findById(req.params.id).select(
      "-passwordHash"
    );

    if (!userDetail) {
      throw new Error("The User not find !");
    }

    res.status(201).json({
      status: true,
      data: userDetail,
      code: 200,
      message: "User is find succesful !",
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

router.get(`/get/count`, async (req, res) => {
    try {
      const usersCount = await User.countDocuments();
  
      if (!usersCount) {
        throw new Error("The User not find !");
      }
  
      res.status(201).json({
        status: true,
        data: usersCount,
        code: 200,
        message: "User is count succesful !",
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

router.post(`/`, async (req, res) => {
  try {
    let user = new User({
      name: req.body.name,
      email: req.body.email,
      passwordHash: bcrypt.hashSync(req.body.passwordHash, 10),
      street: req.body.street,
      apartment: req.body.apartment,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
    });
    user = await user.save();

    if (!user) {
      throw new Error("The Product is not created !");
    }

    res.status(201).json({
      status: true,
      data: user,
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

router.put(`/:id`, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new Error("The ID is not a valid User ID!");
    }

    const findUser = await User.findById(req.params.id);
    let newPasswordHashed = findUser.passwordHash;

    if (req.body.passwordHash) {
      newPasswordHashed = bcrypt.hashSync(req.body.passwordHash, 10);
    }

    const userUpdated = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        passwordHash: newPasswordHashed,
        street: req.body.street,
        apartment: req.body.apartment,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
      },
      { new: true }
    );

    if (!userUpdated) {
      throw new Error("The User is not updated !");
    }

    res.status(201).json({
      status: true,
      data: userUpdated,
      code: 200,
      message: "User is updated succesful !",
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
    const userDeleted = await User.findByIdAndDelete(req.params.id);
  
    try {
      // if(!mongoose.isValidObjectId(req.params.id)){
      //     throw new Error('The Id of product is not valid ID !');
      // }
      if (_.isEmpty(userDeleted) === false) {
        res.status(201).json({
          status: true,
          data: userDeleted,
          code: 200,
          message: "User is deleted succesful !",
        });
      } else {
        throw new Error("The User cannot be deleted !");
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

router.post(`/login`, async (req, res) => {
  try {
    const findUser = await User.findOne({ email: req.body.email });

    if (!findUser) {
      throw new Error("The User is not existed !");
    }

    if (
      !(
        findUser && bcrypt.compareSync(req.body.password, findUser.passwordHash)
      )
    ) {
      throw new Error("Password is Wrong");
    }
    const secret = process.env.secret;
    const token = jwt.sign(
      {
        userId: findUser.id,
        isAdmin: findUser.isAdmin,
      },
      secret,
      {
        expiresIn: "1d",
      }
    );

    res.status(201).json({
      status: true,
      data: { email: findUser.email, token: token },
      code: 200,
      message: "The User is login succesful !",
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
