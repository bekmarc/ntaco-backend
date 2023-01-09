const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    color: {
        type: String,
        
    },
    icon: {
        type: String
    },
    image : {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

categorySchema.virtual('id').get(function () {
    return this._id.toHexString();
 });

categorySchema.set('toJSON', {
    virtuals: true
})

exports.Category = mongoose.model('Category', categorySchema);