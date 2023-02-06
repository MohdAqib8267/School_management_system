
const express=require('express');
const router = express.Router();

const teacherModel = require('../Modals/TeachersModel');



//Add Attandance Api for current month
router.post('/attandance/:id',async(req,res)=>{
    //set route in postman-->http://localhost:5000/api/teacher/attandance/teacher-id
    // console.log(req.params.id);
    const id=req.params.id;
    try{
        //find teacher corrosponding to id
        const teacher = await teacherModel.findById(id);
        // res.send(teacher);

        //if teacher does not exist
        if(!teacher){
            return res.status(401).json("Unauthorizerd Access");
        }
        // //update the teacher attandance
        const present = req.body.present;
        const absent = req.body.absent;
        const half = req.body.half;
        //  res.send(date);
         teacher.currentMonthAttandance.push({present:present,absent:absent,half:half});
        await teacher.save();

        // //Return success message
        res.send({ success: 'Attendance added successfully' });
    }
    catch(error){
        res.status(500).json(error);
    }
});

//route to create a new leave record for a teacher
router.post('/:id/leaverequest',async(req,res)=>{
    //set route in postman-->http://localhost:5000/api/teacher/teacher-id/leaverequest
    try {
        
        //find teacher 
        const id = req.params.id;
        // res.send(id);
        const teacher = await teacherModel.findById(id);
       
        if(!teacher){
            res.status(404).json("Teacher not found");
        }
        teacher.leavesTaken +=1;
        await teacher.save();
        res.status(200).send(teacher);
       
    } catch (error) {
        res.status(500).json(error);
    }
})

// Route to get the number of leaves taken by a teacher in  month
router.get('/:id/leave',async(req,res)=>{
    //set route in postman-->http://localhost:5000/api/teacher/teacher-id/leave
    const id = req.params.id;
    // res.send(id)
    
    try {
        const teacher = await teacherModel.findById(id);
        // res.send(teacher);
        if (!teacher) return res.status(404).send("Teacher not found");

        //count leaves of the month
        const totalLeaves = JSON.stringify(teacher.leavesTaken);
        // res.send(totalLeaves);
        if(totalLeaves > 7){
            res.status(201).json("Red Flag! You have take more than 7 leaves");
        }
        res.send(totalLeaves);
       
    } catch (error) {
        res.status(500).json(error);
    }
})
//route for add prev month attandance 
router.post('/:id/prev-month',async(req,res)=>{
    //set route in postman-->http://localhost:5000/api/teacher/teacher-id/prev-month
    const id=req.params.id;
    try {
        const teacher = await teacherModel.findById(id);
        // res.send(teacher);
        if(!teacher){
            res.status(404).json("Teacher not found");
        }
        // res.send(req.body)
        const present = req.body.present;
        const absent = req.body.absent;
        const half = req.body.half;
        
            teacher.previousMonthAttandance.push({"present":present, "absent":absent, "half":half});
            await teacher.save();
            res.status(200).json("Success");

    } catch (error) {
        res.status(500).json(error);
    }
})



module.exports=router