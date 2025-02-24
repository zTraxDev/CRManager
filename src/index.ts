import './middleware/index.js'
import express from 'express';
import session from 'express-session'
import MongoStore from 'connect-mongo';
import MongoSanitize from "express-mongo-sanitize"
import passport from './config/passport.js'
import { config } from './config/config.js';
import { router } from './routes/index.routes.js';

const app = express();

app.use(session({
    secret: config.session_secret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: config.mongodbUri,
        collectionName: 'sessions',
        ttl: 6000 * 60, // 🔹 Expira en 100 horas
        autoRemove: 'disabled'
    }),
    cookie: {
        maxAge: 6000 * 60 * 1000,
        httpOnly: true, // ⬅️ Protege contra ataques XSS
        secure: false, // ⬅️ Cambia a `true` si usas HTTPS
    }
}));

app.use(MongoSanitize())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize())
app.use(passport.session())

app.use('/', router)

export { app }