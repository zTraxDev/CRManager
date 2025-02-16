import { userModel } from "../models/user.model";
import { Request, Response } from 'express'
import { eventLogger } from "../utils/logger/logger";

class AuthController{

    private model;

    constructor(){
        this.model = userModel
    }

    async register(req: Request, res: Response){
        try {
            const { user, email, password } = req.body
        } catch (error: any) {
            eventLogger.error(`Error del servidor o registrar el usuario ${error}`)
        }
    }
}