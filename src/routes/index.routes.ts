import { Router } from 'express';
import authRouter from './auth/auth.routes.js';
import planesRouter from './user/planes.routes.js';
import clientRouter from './user/clients.routes.js';

const router = Router();

router.use('/auth', authRouter)
router.use('/planes', planesRouter)
router.use('/clients', clientRouter)

export { router }