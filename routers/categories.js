const Category = require('../models/category').Category;
const express = require('express');
const router = express.Router();
const _ = require('lodash');


router.get(`/`, (async (req, res) => {
    const categorieList = await Category.find()

    if(!categorieList || categorieList.length <= 0) {
        res.status(201).json({
            status: false,
            data: [],
            code: 200,
            message: "Empty Data !"
        });
    }

    res.send(categorieList);
}))

router.get(`/:id`, (async (req, res) => {

    try {

        const categoryDetail = await Category.findById(req.params.id);
    
        if(!categoryDetail){
            throw new Error('The Category not find !') 
        }
    
        res.status(201).json({
            status: true,  
            data: categoryDetail,
            code: 200,
            message: "Category is find succesful !"
        });
    
       } catch (error) {
        
        res.status(500).json({
            status: false,
            data: error,
            code: 500,
            message: error.message
        })   
    
       }

    
}))

router.put(`/:id`, (async (req, res) => {

    try {

        const categoryUpdated = await Category.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color
        }, {new : true});
    
        if(!categoryUpdated){
            throw new Error('The Category not updated !') 
        }
    
        res.status(201).json({
            status: true,  
            data: categoryUpdated,
            code: 200,
            message: "Category is updated succesful !"
        });
    
       } catch (error) {
        
        res.status(500).json({
            status: false,
            data: error,
            code: 500,
            message: error.message
        })   
    
       }

    
}))

router.post(`/`, (async (req, res) => {

    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    });
    
    try {

    category = await category.save();

    if(!category){
        throw new Error('The Category cannot be created !')
    }

    res.status(201).json({
        status: true,
        data: category,
        code: 200,
        message: "Category is create succesful !"
    });

   } catch (error) {
    
    res.status(500).json({
        status: false,
        data: error,
        code: 500,
        message: error.message
    })   

   }

}))

router.delete(`/:id`, (async (req, res) => {
    const categorySearched = await Category.findByIdAndDelete(req.params.id)

    try {
        if(_.isEmpty(categorySearched) === false){
            res.status(201).json({
                status: true, 
                data: categorySearched,
                code: 200,
                message: "Category is deleted succesful !"
            });
        }else{
            throw new Error('The Category cannot be deleted !');
        }
      
    
        
    } catch (error) {
        console.log(err)
        res.status(500).json({
            status: false,
            data: error,
            code: 500,
            message: error.message
        })   
    }
}))

module.exports = router;