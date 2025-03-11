import { z } from 'zod';

export const planeSchema = z.object({
    name: z.string({ required_error: 'El nombre es requerido', invalid_type_error: "El nombre deber ser texto" }).min(3).max(255),
    //float
    price: z.number({
        required_error: 'El precio es requerido',
        invalid_type_error: "El precio debe ser un numero"
    }).int().positive(),
    mbpsupload: z.number({
        required_error: 'Los megas son requerido',
        invalid_type_error: "Los megas deben ser un numero"
    }).int().positive(),
    mbpsdownload: z.number({
        required_error: 'Los megas son requerido',
        invalid_type_error: "Los megas deben ser un numero"
    }).int().positive(),
});