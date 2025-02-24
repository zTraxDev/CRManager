import { planModel } from '../models/plans.model';
import { Request, Response } from 'express';
import { eventLogger, dbLogger } from "../utils/logger/logger";
import { userModel } from '../models/user.model';

class PlansController {
    constructor() { }

    public async getPlans(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user?._id;

            const plans = await planModel.find({ user: userId });
            res.status(200).json(plans);
        } catch (error: any) {
            eventLogger.error("Error al obtener los planes: " + error.message);
        }
    }

    public async getPlan(req: Request, res: Response): Promise<any> {
        try {
            const userId = req.user?._id;
            const { id } = req.params;

            const plan = await planModel.findOne({ _id: id, user: userId });

            if (!plan) return res.status(404).json({ message: 'Plan no encontrado' });

            eventLogger.info(`${userId} ha consultado el plan ${plan.name}`);
            res.status(200).json(plan);
        } catch (error: any) {
            eventLogger.error("Error al obtener el plan: " + error.message);
        }
    }

    public async createPlan(req: Request, res: Response): Promise<any> {
        try {
            const { name, price, mbpsupload, mbpsdownload } = req.body;
            const userId = req.user?._id

            if (!userId) return res.status(401).json({ message: 'No autorizado' });

            const planObject = {
                name,
                price,
                mbpsupload,
                mbpsdownload,
                user: userId
            }

            const newPlan = await planModel.create(planObject);

            dbLogger.info(`Plan creado: ${newPlan.name}`);

            await userModel.findByIdAndUpdate(userId, { $push: { plans: newPlan._id } });

            res.status(201).json({ message: 'Plan creado correctamente', data: newPlan });
        } catch (error: any) {
            eventLogger.error("Error al crear el plan: " + error.message);
        }
    }

    public async updatePlan(req: Request, res: Response): Promise<any> {
        try {
            const userId = req.user?._id;
            const { id } = req.params;
            const { name, price, mbpsupload, mbpsdownload } = req.body;

            const plan = await planModel.findOne({ _id: id, user: userId });

            if (!plan) return res.status(404).json({ message: 'Plan no encontrado' });

            const updatedPlan = await planModel.findByIdAndUpdate(id, { name, price, mbpsupload, mbpsdownload }, { new: true });

            if (!updatedPlan) return res.status(404).json({ message: 'Plan no encontrado' });

            dbLogger.info(`Plan actualizado: ${updatedPlan.name}`);

            res.status(200).json({ message: 'Plan actualizado correctamente', data: updatedPlan });
        } catch (error: any) {
            res.status(500).json({ message: 'Error interno del servidor' });
            eventLogger.error("Error al actualizar el plan: " + error.message);
        }
    }

    public async deletePlan(req: Request, res: Response): Promise<any> {
        try {
            const userId = req.user?._id;
            const { id } = req.params;

            const plan = await planModel.findOne({ _id: id, user: userId });

            if (!plan) return res.status(404).json({ message: 'Plan no encontrado' });

            await planModel.findByIdAndDelete({ _id: id });

            await userModel.findByIdAndUpdate(userId, { $pull: { plans: plan._id } })

            dbLogger.info(`Plan eliminado: ${plan.name}`);

            res.status(200).json({ message: 'Plan eliminado correctamente' });
        } catch (error: any) {
            eventLogger.error("Error al eliminar el plan: " + error.message);
        }
    }

}

export const plansController = new PlansController();