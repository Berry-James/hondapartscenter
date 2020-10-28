let mongoose = require('mongoose');
let Utils = require('./../Utils.js');

const Schema = mongoose.Schema;
const UserSchema = new Schema(
    {
        username: { type: String },
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        phone_number: { type: String },
        vehicle: { type: String, required: true },
        vehicle_img: { type: String },
    },
    {
        versionKey: false
    }
);
// encrypt password
UserSchema.pre('save', function(next) {
    // check if password is present and modified
    if(this.password && this.isModified() ){
        this.password = Utils.hashPassword(this.password);
    }
    next();
});



let User = mongoose.model('User', UserSchema);
module.exports = User;