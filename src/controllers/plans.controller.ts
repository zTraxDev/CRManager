import { planModel } from '../models/plans.model';
import { Request, Response } from 'express';
import { eventLogger, dbLogger } from "../utils/logger/logger";
import { userModel } from '../models/user.model';

class PlansController {
    constructor(){}

    public async getPlans(req: Request, res: Response): Promise<void> {
        try {
            const plans = await planModel.find();
            res.status(200).json(plans);
        } catch (error: any) {
            eventLogger.error("Error al obtener los planes: " + error.message);
        }
    }

    public async getPlan(req: Request, res: Response): Promise<void> {
        try {
            const plan = await planModel.findById(req.params.id);
            res.status(200).json(plan);
        } catch (error: any) {
            eventLogger.error("Error al obtener el plan: " + error.message);
        }
    }

    public async createPlan(req: Request, res: Response): Promise<void> {
        try {
            const { name, price, mbpsupload, mbpsdownload } = req.body;

            const newPlan = new planModel({
                name,
                price,
                mbpsupload,
                mbpsdownload
            });

            await newPlan.save();

            res.status(201).json({ message: 'Plan creado correctamente' });
        } catch (error: any) {
            eventLogger.error("Error al crear el plan: " + error.message);
        }
    }
}