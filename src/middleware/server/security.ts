import helmet from "helmet";
import MongoSanitize from "express-mongo-sanitize";
import { Router } from "express";
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    message: "Demasiados intentos, vuelve a intentarlo en un rato",
})
export const securityMiddleware = Router();

// securityMiddleware.use(limiter)
securityMiddleware.use(MongoSanitize());
