import { Router } from 'express';
import authRouter from './auth/auth.routes.js';
import planesRouter from './user/planes.routes.js';

const router = Router();

router.use('/auth', authRouter)
router.use('/planes', planesRouter)

export { router }