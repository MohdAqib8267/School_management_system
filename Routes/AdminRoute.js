const express =require('express');
const jwt = require('jsonwebtoken');
const AdminModel = require('../Modals/AdminModel');
const bcrypt = require('bcrypt');
const teacherModel = require('../Modals/TeachersModel');
const router = express.Router()

//Admin Login Api(Head of School)
router.post('/login',async(req,res)=>{
    //set route in postman-->http://localhost:5000/api/admin/login
    const data =req.body
    // res.send(data);
    try {
        //find by email id
        const admin = await AdminModel.findOne({email:data.email});
        if(!admin){
            res.status(404).json("email or password incorrect");
        }
        //compare password
        const isMatch = await bcrypt.compare(data.password,admin.password);
        // res.send(isMatch);
        if(!isMatch){
            res.status(404).json("email or password incorrect");
        }
        const token = jwt.sign({adminId: admin._id},process.env.jwtKey);

        res.status(200).send({admin,token});
    } catch (error) {
        res.status(500).json(error);
    }
   
});

//Admin Signup Api
router.post('/signup',async(req,res)=>{
    //set route in postman-->http://localhost:5000/api/admin/signup
    const {adminId,email,password}=req.body;
    // res.send(data);
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password,salt);
    // res.send(hashPass);
    try {
        //Valid the input data
        if(!email || !password){
            res.status(400).json("Email and Password are required feild");
        }
        //check if email is already exist
        const matchEmail = await AdminModel.findOne({email:email});
        if(matchEmail){
           return res.status(400).json("Email is already exist");
        }
        // Create and save the admin
        const newAdmin = new AdminModel({
            adminId:adminId,
            email:email,
            password:hashPass
        })
        const data = await newAdmin.save();

        //jwt
        const token = jwt.sign({adminId: data._id},process.env.jwtKey);

         res.status(200).send({data,token});
       
    } catch (error) {
        return res.status(500).json(error);
    }
});


//router for get prev month attandance(only admin)
router.get('/:id/prev-month',jwtVerification, async(req,res)=>{
    //set route in postman-->http://localhost:5000/api/admin/teacher-id/prev-month
    const id = req.params.id;
    
    try {
        const teacher = await teacherModel.findById(id);
        // res.send(teacher);
        if(!teacher){
            res.status(404).json("Teacher not found");
        }
        const  previousMonthAttandance = teacher.previousMonthAttandance;
        const len = previousMonthAttandance.length;
        
        res.send(previousMonthAttandance[len-1]);
    } catch (error) {
        res.status(500).json(error);
    }
})

//current month attandance (only admin)
router.get('/:id/curr-month',jwtVerification,async(req,res)=>{
    //set route in postman-->http://localhost:5000/api/admin/teacher-id/curr-mont
    const id = req.params.id;
    try {
        const teacher = await teacherModel.findById(id);
        if(!teacher){
            res.status(404).json("Teacher not found");
        }
        const  currMonthAttandance = teacher.currentMonthAttandance;
        const len = currMonthAttandance.length;
        res.send(currMonthAttandance[len-1]);
    } catch (error) {
        res.status(500).json(error);
    }
})

//route for Admin can see All teachers are today present or not(only admin)
router.get("/attandance/today",jwtVerification,async(req,res)=>{
    //set route in postman-->http://localhost:5000/api/admin/attandance/today
    try {
        const teachers = await teacherModel.find({});
        // res.send(teachers)
        const data = teachers.map(teacher => ({
            name: teacher.name,
            id: teacher._id,
            todayAttandance: teacher.todayAttandance
          }));
        res.status(200).send(data);
    } catch (error) {
        res.status(500).json(error);
    }
})

//calculate salery by admin
//suppose salery of a month 30,000
//no paycut for 3 leave
//500Rs cut for leaver if leaver greater than 3
router.get('/:id/salery',jwtVerification,async(req,res)=>{
    //set route in postman-->http://localhost:5000/api/admin/teacher-id/salery
    const id = req.params.id;
    
    
    try {
        const teacher = await teacherModel.findById(id);
        // res.send(teacher);
        if(!teacher){
            res.status(404).json("Teacher not found");
        }
        const  currMonthAttandance = teacher.currentMonthAttandance;
        
        const len = currMonthAttandance.length;
        const present = JSON.stringify(currMonthAttandance[len-1].present);
        const absent = JSON.stringify(currMonthAttandance[len-1].absent);
        const half = JSON.stringify(currMonthAttandance[len-1].half);
        
        // res.send({present,absent,half});
        

        if(absent <= 3){
            return res.status(200).send(`salery of ${teacher.name} is: ${salery}`);
        }
        else{
            teacher.salery = (teacher.salery*present) + (teacher.salery/2)*half;
            return res.status(200).send(`salery of ${teacher.name} is: ${salery}`);
        }
    } catch (error) {
        res.status(500).json(error)
    }
})


//verification of jwt 
//becuase only admin can acess previous month,current month,today attandace etc
// so, we can pass token in each API related to admin
function jwtVerification(req,res,next){
    let token = req.headers['authorization']
    if(token){
        token = token.split(' ')[1];
        // console.log("verification",token);
        jwt.verify(token,process.env.jwtKey,(err,valid)=>{
            if(err){
                res.status(401).json({result: "please provide valid token"});
            }else{
                next();
            }
        })
    }else{
        res.status(404).json({result: "please add token with header"});
    }
    
}
module.exports = router;
