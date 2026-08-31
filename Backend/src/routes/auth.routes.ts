import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller.js'
import { authenticateJWT } from '../middleware/auth.js'

const router = Router()

router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.post('/logout', AuthController.logout)
router.get('/me', authenticateJWT, AuthController.me)

export default router
