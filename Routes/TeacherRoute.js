const express=require('express');
const router = express.Router();
const mongoose = require('mongoose');
const teacherModel = require('../Modals/TeachersModel');
const bcrypt = require('bcrypt');


//Teacher Login Api
router.post('/login',async(req,res)=>{
    //set route in postman-->http://localhost:5000/api/teacher/login
    const {email,password}=req.body;
    // console.log(email,password);
    try {
        const teacher = await teacherModel.findOne({ email });
        //  res.send(teacher);
        if(!teacher){
            return res.status(404).json("Invalid email or password");
        }
        // // //comapre password
        const isMatch=await bcrypt.compare(password,teacher.password);
        // res.send(isMatch);
        if(!isMatch){
            return res.status(404).json("Invalid email or Password");
        }
        res.status(200).json("Teacher Login Successfully");
    } catch (error) {
        res.status(500).json(error);
    }
})
//Teacher Signup APi
router.post('/signup',async(req,res)=>{
    //set route in postman-->http://localhost:5000/api/teacher/signup
    // const data = req.body;
    const {name,teacherId,email,password,salery,todayAttandance}=req.body
   
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password,salt);
    // res.send(hashPass);
    // res.send({name,teacherId,email,password})

    try {
     
        if(!email || !password){
            res.status(400).json("Email and Password are required feild");
        }
        //   //check if email is already exist
           const matchEmail = await teacherModel.findOne({email:email});
        //    res.send(matchEmail);
          if(matchEmail){
             return res.status(400).json("Email is already exist");
          }
        
        // // save teacher 
          const newteacher = new teacherModel({
            name:name,
            teacherId:teacherId,
            password:hashPass,
            email:email,
            todayAttandance:todayAttandance,
            salery:salery,

          });
        //    res.send(newteacher);
          const result = await newteacher.save();
          res.status(200).send(result);
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports=router;