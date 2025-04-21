import bcrypt from 'bcrypt'
import User from '../Models/user.js'
import jwt from 'jsonwebtoken'

export const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "Please fill all fields" })
    }
    const userexists = await User.findOne({ email });

    if (userexists) {
        return res.status(400).json({ message: 'User already exits' })
    }

    const hashedPass = await bcrypt.hash(password, 10)
    const newUser = await User.create({ name, email, password: hashedPass, role });

    res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
    })


}

export const loginUser = async (req, res) => {
    const { email, password } = req.body
    const userexists = await User.findOne({ email })



    if (userexists) {
        const isMatch = await bcrypt.compare(password, userexists.password)
        if (isMatch) {
            const token = jwt.sign({ id: userexists._id, role: userexists.role }, process.env.JWT_SECRET)
            res.status(201).json({
                _id: userexists._id,
                name: userexists.name,
                email: userexists.email,
                role: userexists.role,
                token: token,
            })
        }else{
            return res.status(400).json({message:"Wrong Passowrd"})
        }
    } else {
        res.status(401).json({ message: "Invalid credentials" })
    }
}

export const getCurrentUser = (req,res) =>{
    if(!req.user){
        return res.status(401).json({message:"unauthorized"})
    }
    return res.json({name:req.user.name,email:req.user.email,role:req.user.role})
}