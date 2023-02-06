const mongoose = require('mongoose');

const AttandanceSchema = new mongoose.Schema({
    present: Number,
    absent:Number,
    half:Number
})

//Teacher Collection Schema
const teacherSchema = new mongoose.Schema({
    teacherId:{type:String},
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    
    // currentMonthAttandance:{type:Map, of:String,default:{}},
    todayAttandance:{type:Map, of:String,default:{}, required: true},  //postman format- {"give date":"present/Absent"}
    currentMonthAttandance:[AttandanceSchema],
    previousMonthAttandance:[AttandanceSchema],
    leavesTaken:{type:Number,default:0},
    salery:{type:Number, required: true},
});
const teacherModel=mongoose.model("teachers_collections",teacherSchema);
module.exports = teacherModel;