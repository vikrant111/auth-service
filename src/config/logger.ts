
import winston from "winston";
import { Config } from ".";

const logger = winston.createLogger({
    level: "info",
    defaultMeta:{
        serviceName: "auth-service"
    },
    transports: [
        new winston.transports.File({
            level: "info",
            dirname: "logs",
            filename: "combined.log",
            silent: Config.NODE_ENV === "test",
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
                winston.format.prettyPrint(),
            ),
        }),
        new winston.transports.File({
            level: "error",
            dirname: "logs",
            filename: "error.log",
            silent: Config.NODE_ENV === "test",
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
                winston.format.prettyPrint(),
            ),
        }),
        new winston.transports.Console({
            level:"info",
            silent: Config.NODE_ENV === "test",
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
                winston.format.prettyPrint(),
            ),
        })
    ]
})

export default logger;