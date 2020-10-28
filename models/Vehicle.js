let mongoose = require('mongoose');
const Schema = mongoose.Schema;
const VehicleSchema = new Schema(
    {
        name: { type: String, required: true }
    },
    {
        versionKey: false
    }
);

let Vehicle = mongoose.model('Vehicle', VehicleSchema);
module.exports = Vehicle;