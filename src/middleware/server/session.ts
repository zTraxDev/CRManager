import session from "express-session";
import MongoStore from "connect-mongo";
import { config } from "../../config/config";

export const sessionMiddleware = session({
    secret: config.session_secret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: config.mongodbUri,
        collectionName: "sessions",
        ttl: 100 * 60 * 60, // 100 horas
        autoRemove: "disabled"
    }),
    cookie: {
        maxAge: 100 * 60 * 60 * 1000, // 100 horas en milisegundos
        httpOnly: true, // Protege contra XSS
        secure: false, // Cambiar a `true` en producción con HTTPS
    }
});
