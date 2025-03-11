import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { eventLogger } from "../utils/logger/logger";

/**
 * Middleware para validar requests con Zod
 * @param schema - El esquema de Zod para validar los datos
 */
export const validatorSchema =
  <T>(schema: z.ZodType<T>) =>
  (req: Request, res: Response, next: NextFunction): any => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      eventLogger.error(`Datos inválidos enviados desde ${req.baseUrl}`);

      // Obtener errores de Zod en un formato más simple
      const formattedErrors = Object.entries(result.error.flatten().fieldErrors).map(
        ([field, messages]) => ({
          field,
          message: Array.isArray(messages) && messages.length > 0 ? messages[0] : "Error desconocido",
        })
      );
      

      return res.status(400).json({
        error: "Invalid request",
        details: result.error.flatten().fieldErrors,
      });
    }

    req.body = result.data;
    next();
  };

