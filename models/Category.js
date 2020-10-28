let mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CategorySchema = new Schema(
    {
        name: { type: String, required: true }
    },
    {
        versionKey: false
    }
);

let Category = mongoose.model('Category', CategorySchema);
module.exports = Category;