import { Router } from "express";
import { plansController } from "../../controllers/plans.controller";
import { authMiddleware } from "../../middleware/user/auth";

const planesRouter = Router();

planesRouter.post('/create', authMiddleware, plansController.createPlan)
planesRouter.delete('/delete/:id', authMiddleware, plansController.deletePlan)
planesRouter.put('/update/:id', authMiddleware, plansController.updatePlan)
planesRouter.get('/get', authMiddleware, plansController.getPlans)

export default planesRouter;