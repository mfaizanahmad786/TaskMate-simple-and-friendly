import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    category:{type:String,required:false},
    assignedTo:{type:mongoose.Schema.ObjectId, ref:'User',required:true},
    assignedBy:{type:mongoose.Schema.ObjectId,ref:'User',required:true},
    acceptanceStatus:{type:String,enum:['Accepted','Rejected','Pending'],default:'Pending'},
    rejectionFeedback:{type:String},
    status:{type:String,enum:['Pending','In-Progress','Completed'],default:'Pending'},
    createdAt:{type:Date,default:Date.now()}
})

export default mongoose.model('Task',taskSchema)