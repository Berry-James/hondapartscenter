let mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PartSchema = new Schema(
    {
        part_number: { type: String, required: true },
        part_name: { type: String, required: true },
        manufacturer: { type: String, required: true },
        category: { type: String, required: true },
        vehicle_fitment: { type: String, required: true },
        price: { type: Number },
        availability: { type: String, required: true }
    },
    {
        versionKey: false
    }
);

let Part = mongoose.model('Part', PartSchema);
module.exports = Part;