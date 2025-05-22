import { DataSource } from "typeorm"
import app from "../../src/app"
import request from "supertest"
import { AppDataSource } from "../../src/config/data-source";
import { isJWT, truncateTables } from "../utils";
import { User } from "../../src/entity/User";
import { Roles } from "../../src/constants";
import { cookie } from "express-validator";
import { RefreshToken } from "../../src/entity/RefreshToken";


describe("POST /tenants", ()=>{
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
        it("should return a 201 status code", async()=>{
             //AAA formula
            // Arrange, Act, Assert
            const tenantData = {
               name: "tenantName",
               address: "tenantAddress"
            }

            //Act
            const response = await request(app)
            .post("/tenants")
            .send(tenantData)

            //Assert
            expect(response.statusCode).toBe(201)
        })
    })

})