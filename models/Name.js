let mongoose = require('mongoose');
const Schema = mongoose.Schema;
const NameSchema = new Schema(
    {
        part_name: { type: String, required: true }
    },
    {
        versionKey: false
    }
);

let Name = mongoose.model('Name', NameSchema);
module.exports = Name;