import winston from "winston";
import path from "path";
import fs from "fs";

import { getLogFileName } from "./getLogFIleName";

const logDir = path.join(__dirname, "..", "..", "logs");
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

const { combine, timestamp, json, errors } = winston.format

export const logger = winston.createLogger({
    level: 'info',
    format: combine(timestamp(), errors({stack: true}), json()),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: `${logDir}/${getLogFileName()}`,
            level: 'info'
        })
    ]
  });

export const loggerStream = {
    write: (message: string) => {
        logger.info(message.trim()); // Remove unnecessary newlines
    },
};