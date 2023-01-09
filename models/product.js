const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name:  {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    richDescription: {
        type: String,
        default:'' 
    },
    image: {
        type: String,
        required: true
    },
    images: [{
        type: String
    }],
    brand: {type: String},
    price: {type: Number, required: true},
    category: {
        type: Schema.Types.ObjectId,
        ref : 'Category',
        required: true
    },
    countInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    rating: {
        type: Number,
        default: 0
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    numReviews: {
        type: Number,
        default: 0
    },

    dateCreated: {
        type: Date,
        default: Date.now
    }
})


productSchema.virtual('id').get(function () {
   return this._id.toHexString();
});

productSchema.set('toJSON', {
    virtuals: true
})

exports.Product = mongoose.model("Product", productSchema);
exports.userSchema = this.userSchema;