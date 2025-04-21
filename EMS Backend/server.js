import express from 'express'
import taskRouter from './Routes/taskRoutes.js'
import authRouter from './Routes/authRoutes.js'
import connectDB from './Config/db.js'
import cors from 'cors'
import dotenv from 'dotenv'
connectDB()

const app = express()
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true, // if you ever need cookies or auth headers
}));
dotenv.config()



app.use(express.json())

app.use('/api/auth',authRouter)
app.use('/api/tasks',taskRouter)


app.listen(5000,()=>{
    console.log("Server running ")
})