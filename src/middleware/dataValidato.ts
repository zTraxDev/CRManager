import { z, ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express"
import { eventLogger } from "../utils/logger/logger";

/**
 * Middleware para validar requests con Zod
 * @param schema - El esquema de Zod para validar los datos
 */

export const validatorSchema = 
(schema: ZodSchema) => 
    (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body)

        if(!result.success){
            eventLogger.error(`Datos invalidos enviados desde ${req.baseUrl}`)
            return res.json({
                error: 'Invalid request',
                detail: result.error.format()
            })
        }

        req.body = result.data
        next()
    }