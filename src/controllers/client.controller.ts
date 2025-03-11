import { userModel } from "../models/user.model"
import { Client } from "../models/client.model"
import { planModel } from "../models/plans.model"
import { dbLogger, eventLogger } from '../utils/logger/logger'
import { Request, Response, NextFunction } from "express"
import { parse, format } from "date-fns"

class ClientsController {

    constructor() {}

    /**
     * async createClient
     */
    public async getAllClients(req: Request, res: Response): Promise<any> {
        try {
            const user = req.user?._id;
    
            const findAllUsers = await Client.find({ user: user }).populate('plan', 'name');
    
            if (!findAllUsers.length) return res.status(404).json({
                success: false,
                message: 'No tienes clientes agregados'
            });
    
            const formattedClients = findAllUsers.map(client => ({
                ...client.toObject(),
                date_pay: format(new Date(client.date_pay), 'dd/MM/yyyy'), // Formato dd/MM/yyyy
            }));
    
            return res.status(200).json({
                success: true,
                message: 'Clientes encontrados',
                data: formattedClients
            });
    
        } catch (error: any) {
            res.status(500).json({ message: 'Error interno del servidor' });
            eventLogger.info(`Error interno del servidor ${error}`);
        }
    }
    
    public async getClientById(req: Request, res: Response): Promise<any> {
        try {
            const user = req.user?._id
            const { id } = req.params

            if (!id) {
                return res.status(400).json({ 
                    status: 400, 
                    success: false, 
                    message: 'El ID del cliente es obligatorio' 
                });
            }    

            const findClient = await Client.findOne({ _id: id, user: user}).populate('plan', 'name')

            if (!findClient) {
                return res.status(204).json({
                    status: 204,
                    success: false,
                    message: 'No tienes este cliente agregado'
                })
            }

            return res.status(200).json({
                status: 200,
                success: true,
                message: 'Cliente encontrado',
                data: findClient
            })
        } catch (error: any) {
            res.status(500).json({ message: 'Error interno del servidor' });
            eventLogger.info(`Error interno del servidor ${error}`);
        }
    }

    public async getClientByName(req: Request, res: Response): Promise<any> {
        try {
            const user = req.user?._id
            const { name } = req.body

            const findClient = await Client.findOne({ user: user, name: name })

            if(!findClient) return res.status(204).json({
                status: 204,
                success: false,
                message: 'No tienes este cliente agregado'
            })

            return res.status(200).json({
                status: 200,
                success: true,
                message: 'Cliente encontrado',
                data: findClient
            })
        } catch (error: any) {
            res.status(500).json({ message: 'Error interno del servidor' });
            eventLogger.info(`Error interno del servidor ${error}`);
        }
    }

    public async createClient(req: Request, res: Response): Promise<any> {
        try {
            const user = req.user

            let { name, pay, plan, date_pay } = req.body;

            const findClient = await Client.findOne({ name });
            const findPlan = await planModel.findOne({ user: user?._id, name: plan });

            if (findClient) return res.status(404).json({ success: false, message: 'Este cliente ya existe' });
            if (!findPlan) return res.status(404).json({ success: false, message: 'No tienes este plan creado' });

            let plaName = findPlan.name;
            let formattedDate: Date;


            if (!date_pay || typeof date_pay !== "string") {
                const now = new Date();
                formattedDate = now;
            } else {
                try {
                    formattedDate = parse(date_pay, 'dd/MM/yyyy', new Date());

                    if (isNaN(formattedDate.getTime())) {
                        return res.status(400).json({ success: false, message: "Fecha inválida. Formato esperado: dd/MM/yyyy" });
                    }
                } catch (error) {
                    return res.status(400).json({ success: false, message: "Formato de fecha inválido. Usa dd/MM/yyyy" });
                }
            }

            const newClient = await Client.create({
                name,
                pay,
                date_pay: formattedDate,
                plan: findPlan._id,
                user: user?._id
            });

            await userModel.findByIdAndUpdate(user?._id, { $push: { clients: newClient._id } })

            const formatedClient = {
                ...newClient.toObject(),
                plan: plaName,
                date_pay: format(newClient.date_pay, 'dd/MM/yyyy') // 🔹 Devuelve siempre en `dd/MM/yyyy`
            };

            return res.status(201).json({
                status: 201,
                success: true,
                message: 'Cliente creado exitosamente',
                data: formatedClient
            });
        } catch (error: any) {
            res.status(500).json({ message: 'Error interno del servidor' });
            eventLogger.info(`Error interno del servidor ${error}`);
        }
    }

    public async updateClient(req: Request, res: Response): Promise<any> {
        try {
            const user = req.user

            let { id } = req.params
            let { name, pay, plan, date_pay } = req.body;

            const findPlan = await planModel.findOne({ user: user?._id, name: plan });

            if (!findPlan) return res.status(404).json({ success: false, message: 'No tienes este plan creado' });

            let planName = findPlan?.name

            let formattedDate: Date

            formattedDate = parse(date_pay, 'dd/MM/yyyy', new Date());
            
            if (isNaN(formattedDate.getTime())) {
                return res.status(400).json({ success: false, message: "Fecha inválida. Formato esperado: dd/MM/yyyy" });
            }

            const updateClient = await Client.findByIdAndUpdate(id, { name, pay, plan: planName, date_pay: formattedDate}, { new: true})

            if(!updateClient) return res.status(400).json({
                status: 400,
                success: false,
                message: 'Cliente no encontrado para actualizar'
            })

            return res.status(200).json({
                status: 200,
                success: true,
                message: 'Cliente actualizado correctamente',
                data: updateClient
            })
        } catch (error: any) {
            res.status(500).json({ message: 'Error interno del servidor' });
            eventLogger.info(`Error interno del servidor ${error}`);
        }
    }

    public async deleteClient(req: Request, res: Response): Promise<any> {
        try {
            const user = req.user
            const { id } = req.params
            
            const findClient = await Client.findByIdAndDelete({ _id: id})

            if(!findClient) {
                return res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'No tienes este cliente agregado'
                })
            }

            await userModel.findByIdAndUpdate(user?._id, { $pull: { clients: findClient._id } })

            dbLogger.info(`Usuario ${user?.name} ha eliminado el cliente ${findClient.name}`);

            return res.status(200).json({
                status: 200,
                success: true,
                message: 'Cliente eliminado exitosamente',
                client: findClient
            })
        } catch (error: any) {
            res.status(500).json({ message: 'Error interno del servidor' });
            eventLogger.info(`Error interno del servidor ${error}`);
        }
    }
}

export const ClientController = new ClientsController()