import './middleware/index.js';
import express from 'express';
import passport from './config/passport.js';
import cors from 'cors'
import { sessionMiddleware } from './middleware/server/session.js';
import { securityMiddleware } from './middleware/server/security.js';
import { router } from './routes/index.routes.js';
import { config } from './config/config.js';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // Permite solicitudes solo desde esta URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
    credentials: true
  }));

app.use(sessionMiddleware);
app.use(securityMiddleware);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', router);

export { app };