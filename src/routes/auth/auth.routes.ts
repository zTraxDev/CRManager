import { Router } from "express";
import { authController } from "../../controllers/auth.controller";
import { validatorSchema } from "../../middleware/dataValidato";
import { registerSchema } from "../../validators/register";

const authRouter = Router()

authRouter.post('/register', validatorSchema(registerSchema), authController.register)
authRouter.post('/login', authController.login)

export default authRouter