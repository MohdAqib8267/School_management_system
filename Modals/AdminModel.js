const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    adminId:{type:String, required:true, unique:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true, unique:true}
})

const AdminModel = mongoose.model('Admin_collection',AdminSchema);
module.exports = AdminModel; 