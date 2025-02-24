import './middleware/index.js'
import express from 'express';
import session from 'express-session'
import MongoStore from 'connect-mongo';
import MongoSanitize from "express-mongo-sanitize"
import passport from './config/passport.js'
import { config } from './config/config.js';
import { connectDB } from './config/db.js';
import { eventLogger } from './utils/logger/logger.js';
import { router } from './routes/index.routes.js';

const app = express();
const PORT = config.port;

app.use(session({
    secret: config.session_secret,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: config.mongodbUri,
        collectionName: 'sessions',
        ttl: 60 * 60
    }),
    cookie: {
        maxAge: 100 * 60 * 60
    }
}))

app.use(MongoSanitize())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize())
app.use(passport.session())

app.use('/', router)

app.listen(PORT, () => {
    eventLogger.info(`Servidor Express escuchando en http://localhost:${PORT}`)
    connectDB()
});

export { app }