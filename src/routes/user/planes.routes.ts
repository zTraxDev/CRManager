import { Router } from "express";
import { plansController } from "../../controllers/plans.controller";
import { authMiddleware } from "../../middleware/user/auth";
import { planeSchema } from "../../validators/planes";
import { validatorSchema } from "../../middleware/dataValidato";

const planesRouter = Router();

planesRouter.get('/getAll', authMiddleware, plansController.getPlans)
planesRouter.get('/:id', authMiddleware, plansController.getPlan)
planesRouter.post('/create', authMiddleware, validatorSchema(planeSchema), plansController.createPlan)
planesRouter.patch('/update/:id', authMiddleware, plansController.updatePlan)
planesRouter.delete('/delete/:id', authMiddleware, plansController.deletePlan)



export default planesRouter;