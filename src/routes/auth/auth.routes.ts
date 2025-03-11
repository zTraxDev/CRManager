import { Router } from "express";
import { authController } from "../../controllers/auth.controller";
import { validatorSchema } from "../../middleware/dataValidato";
import { registerSchema } from "../../validators/register";
import { authMiddleware } from "../../middleware/user/auth";

const authRouter = Router()

authRouter.post('/register', validatorSchema(registerSchema), authController.register)
authRouter.post('/login', authController.login)
authRouter.post('/logout', authController.logout)
authRouter.get('/me', authController.checkSession)
export default authRouter