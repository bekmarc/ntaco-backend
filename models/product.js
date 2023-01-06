const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = Schema({
    name:  String, 
    image: String,
    countInStock: {
        type: Number,
        required: true
    }
})

exports.Product = mongoose.model("Product", productSchema);
