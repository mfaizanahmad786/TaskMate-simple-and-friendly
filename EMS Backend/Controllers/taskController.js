import express from 'express'
import Task from '../Models/task.js';
import User from '../Models/user.js';

export const getOneTask = async (req, res) => {
    try{
    const foundTask = await Task.findById(req.params.id);
    if (foundTask) {
        res.json(foundTask)
    } else {
        res.status(404).json({ message: "Task Not Found" })
    }
}catch(e){
    res.status(500).json({message:'Server Error',error:e.message})
}
}

export const getAllTask = async (req, res) => {
    try{
        let tasks;
        if(req.user.role === 'employee'){
            tasks = await Task.find({assignedTo:req.user._id})
                .populate('assignedTo','name')
                .populate('assignedBy','name')
        }else if(req.user.role === 'manager'){
            tasks = await Task.find({assignedBy:req.user._id})
                .populate('assignedTo','name')
                .populate('assignedBy','name')
        }else{
            return res.status(403).json({message:"Invalid role or unauthorized"})
        }
        res.json(tasks)
    }catch(e){
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

export const createTask = async (req, res) => {
    try {
        const { title, description, assignedTo,category } = req.body;
        if(req.user.role == 'employee'){
            return res.json({message:"Not allowed to create tasks"})
        }

        const employee = await User.findOne({name:assignedTo});

        const newTask = await Task.create({ title, description, assignedTo:employee._id, assignedBy:req.user._id,category })

        res.status(201).json(newTask)
    } catch (e) {
        res.status(500).json({ message: "Server Error", error: e.message })
    }

}

export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (task) {
            await Task.deleteOne({ _id: req.params.id });
            res.json({ message: "Task Deleted" });
        } else {
            res.status(404).json({ message: "Task not Found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}
export const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (task) {
            console.log(req.body.status);
            if(req.body.status === "Accepted"){
                task.acceptanceStatus = req.body.status || "Accepted";
            }
            if(req.body.status === "Completed"){
                task.status = req.body.status || "Completed";
            }
           
            await task.save();
            console.log("came till here")
            res.json(task);
        } else {
            res.status(404).json({ message: "Task not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}


export const respondToTask = async (req,res) =>{
    try{
        const {response,feedback} = req.body;

        if(!['Accepted','Rejected'].includes(response)){
            return res.status(400).json({message:"Response Should be either 'Accepted' or 'Rejected"})
        }

        const task = await Task.findById(req.params.id)
        if(!task){
            return res.status(404).json({message:"Task not found"})
        }

        if(task.assignedTo.toString() !== req.user._id.toString()){
           return res.status(403).json({message:"You can only respond to task assigned to you"})
        }

        task.acceptanceStatus = response;
        
        if(response === 'Rejected'){
            if(!feedback){
                return res.status(400).json({message:"Feedback is required if a task is rejected"})
            }
            task.rejectionFeedback = feedback
            
        }

        if(response === 'Accepted'){
            task.status = 'In-Progress'
        }
        try {
            await task.validate();
        } catch (validationError) {
            console.error("Validation Error:", validationError);
            return res.status(400).json({
                message: "Validation Failed",
                errors: validationError.errors
            });
        }

        try {
            await task.save();
            console.log("saved");
        } catch (saveError) {
            console.error("Save Error:", saveError);
            return res.status(500).json({
                message: "Error saving task",
                error: saveError.message
            });
        }

        try {
            await task.save();
            console.log("saved");
        } catch (saveError) {
            console.error("Save Error:", saveError);
            return res.status(500).json({
                message: "Error saving task",
                error: saveError.message
            });
        }


    }catch(e){
        res.status(500).json({message:"Server Error",eror:e.message})
    }
}

export const getTaskResponses = async (req,res) =>{
    try{
        if(req.user.role !== 'manager'){
            return res.status(400).json({message:"Only managers can access task responses"})
        }

        const tasks = await Task.find({
            assignedBy:req.user._id
        }).populate('assignedTo','name email').sort({updatedAt:-1});

        res.json(tasks)
        

    }catch(e){
        res.status(500).json({message:"Server Error",error:e.message})
    }
}

export const getTaskStats = async (req,res) => {
    try{    

        if(!req.user){
            res.json({message:"User not found"})
        }

        const userID = req.user._id
        const totalTasks = await Task.countDocuments({assignedTo:userID});
        const completedTasks = await Task.countDocuments({assignedTo:userID,status:'Completed'})
        const pendingTasks = await Task.countDocuments({assignedTo:userID,status:'Pending'})
        const rejectedTasks = await Task.countDocuments({assignedTo:userID,acceptanceStatus:'Rejected'})

        res.json({totalTasks,completedTasks,pendingTasks,rejectedTasks})
    }catch(e){
        res.status(500).json({message:"Server Error",error:e.message})
    }
}
