import express from "express";
import {getOneTask,getAllTask,createTask,deleteTask,updateTask,getTaskResponses,respondToTask,getTaskStats} from '../Controllers/taskController.js'
import { protect } from "../Middlewares/authMiddleware.js";
const router = express.Router()

router.get('/',protect,getAllTask)
router.get('/responses',protect,getTaskResponses)
router.get('/taskStats',protect,getTaskStats)
router.get('/:id',protect,getOneTask)
router.post('/',protect,createTask)
router.post('/:id/respond',protect,respondToTask)
router.put('/:id',protect,updateTask)
router.delete('/:id',protect,deleteTask)



export default router