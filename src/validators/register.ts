import { z } from "zod";

/**
 * Esquema de validación para el registro de usuarios
 */
export const registerSchema = z.object({
  name: z.string({ invalid_type_error: 'El nombre debe de ser texto', required_error: 'El nombre es obligatorio'}, ).min(3).max(255),
  email: z.string({ invalid_type_error: 'El correo debe de ser texto', required_error: 'El correo es obligatorio' }).email(),
  password: z.string({ required_error: 'La contraseña es obligatoria'}).min(6).max(255),
});