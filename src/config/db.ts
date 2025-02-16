import mongoose from 'mongoose';
import { config } from './config.js';
import { dbLogger, eventLogger } from '../utils/logger/logger.js';

export const connectDB = async () => {
    try {
        await mongoose.connect(config.mongodbUri || '', {
        });
        mongoose.set("debug", (collection, method, query) => {
            dbLogger.debug(`[${collection}.${method}] ${JSON.stringify(query)}`);
        })
        eventLogger.info(`MongoDB conectado exitosamente`);
    } catch (error) {
        console.error('Error conectando a MongoDB:', error);
    }
};

