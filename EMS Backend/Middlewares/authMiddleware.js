import jwt from 'jsonwebtoken'
import User from '../Models/user.js'

export const protect = async (req,res,next) =>{
    let token = req.headers.authorization;
    if(token && token.startsWith('Bearer')){
        try{
            token = token.split(' ')[1];
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            if(!req.user){
                return res.status(401).json({message:"User not found"})
            }
            next();
        }catch(e){
            res.status(401).json({message:"Not Authorized, token failed",error:e.message})
        }
    }else{
        res.status(401).json({message:"No token, authorization denied"})
    }
}