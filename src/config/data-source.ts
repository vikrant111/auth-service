import "reflect-metadata"
import { DataSource } from "typeorm"
import { Config } from "."


export const AppDataSource = new DataSource({
    type: "postgres",
    host: Config.DB_HOST,
    port: Number(Config.DB_PORT),
    username: Config.DB_USERNAME,
    password: Config.DB_PASSWORD,
    database: Config.DB_NAME,
    //don't use synchronize in production make it as false
    synchronize: false,
    logging: false,
    entities: ["src/entity/*.ts"],
    //all the files inside the migration folder will be considered as the migration scripts
    migrations: ["src/migration/*.ts"],
    subscribers: [],
})
