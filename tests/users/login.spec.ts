import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";



describe("POST auth/login", ()=>{
    let connection: DataSource;

    beforeAll(async ()=>{
        connection = await AppDataSource.initialize()
    })

    beforeEach(async ()=>{
        // need to clean the database before each test run
        await connection.dropDatabase();
        await connection.synchronize();
    //    await truncateTables(connection)
        
    })

    afterAll(async ()=>{
        await connection.destroy()
    })







    describe("Given all fields", ()=>{
        it.todo("")
    })



})