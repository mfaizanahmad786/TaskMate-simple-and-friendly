import express from 'express'
import { registerUser,loginUser,getCurrentUser } from '../Controllers/authController.js'
import { protect } from '../Middlewares/authMiddleware.js'
const router = express.Router()

router.post('/register',registerUser)
router.post('/login',loginUser)
router.get('/getCurrentUser',protect,getCurrentUser)

export default router