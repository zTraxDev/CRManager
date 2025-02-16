import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

// Formato personalizado
const customFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Crear el logger principal
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.colorize(),
    customFormat
  ),
  transports: [
    new winston.transports.Console(), 
    new DailyRotateFile({
      filename: "logs/server-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      level: "info",
    }),
  ],
});

const dbLogger = winston.createLogger({
  level: "debug",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    customFormat
  ),
  transports: [
    new winston.transports.Console(), 
    new DailyRotateFile({
      filename: "logs/db-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "10m",
      maxFiles: "7d",
      level: "debug",
    }),
  ],
});


const eventLogger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    customFormat
  ),
  transports: [
    new winston.transports.Console(), 
    new DailyRotateFile({
      filename: "logs/events-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "5m",
      maxFiles: "30d",
      level: "info",
    }),
  ],
});


export { logger, dbLogger, eventLogger };
