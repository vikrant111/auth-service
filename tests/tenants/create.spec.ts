import { DataSource } from "typeorm"
import app from "../../src/app"
import request from "supertest"
import { AppDataSource } from "../../src/config/data-source";
import { isJWT, truncateTables } from "../utils";
import { User } from "../../src/entity/User";
import { Roles } from "../../src/constants";
import { cookie } from "express-validator";
import { RefreshToken } from "../../src/entity/RefreshToken";
import { Tenant } from "../../src/entity/Tenant";
import createJWKSMock from "mock-jwks";


describe("POST /tenants", ()=>{
    let connection: DataSource;
     let jwks: ReturnType<typeof createJWKSMock>;
     let adminToken: string;


    beforeAll(async ()=>{
        jwks = createJWKSMock('http://localhost:5501')
        connection = await AppDataSource.initialize()
    })

    beforeEach(async ()=>{
        // need to clean the database before each test run
        await connection.dropDatabase();
        await connection.synchronize();
        jwks.start();

        adminToken = jwks.token({
            sub:"1",
            role: Roles.ADMIN
        })
    //    await truncateTables(connection)
        
    })



    afterEach(()=>{
        jwks.stop()
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
            .set('Cookie', [`accessToken=${adminToken}`])
            .send(tenantData)

            //Assert
            expect(response.statusCode).toBe(201)
        })




        it("should create a tenant in the database", async()=>{
            //AAA formula
            // Arrange, Act, Assert
            const tenantData = {
               name: "tenantName",
               address: "tenantAddress"
            }

            //Act
            const response = await request(app)
            .post("/tenants")
            .set('Cookie', [`accessToken=${adminToken}`])
            .send(tenantData)

            const tenantRepository = connection.getRepository(Tenant);
            const tenants = await tenantRepository.find();


            //Assert
            expect(tenants).toHaveLength(1);
            expect(tenants[0].name).toBe(tenantData?.name)
            expect(tenants[0].address).toBe(tenantData?.address)
        })



         it("should return 401 if the user is not authenticated", async()=>{
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

             expect(response.statusCode).toBe(401)

            const tenantRepository = connection.getRepository(Tenant);
            const tenants = await tenantRepository.find();


            //Assert
            expect(tenants).toHaveLength(0);
           
            
        })





         it("should return 403 if the user is not an admin", async()=>{

           const managerToken = jwks.token({
            sub:"1",
            role: Roles.MANAGER
        })

            //AAA formula
            // Arrange, Act, Assert
            const tenantData = {
               name: "tenantName",
               address: "tenantAddress"
            }

            //Act
            const response = await request(app)
            .post("/tenants")
            .set('Cookie', [`accessToken=${managerToken}`])
            .send(tenantData)

             expect(response.statusCode).toBe(403)

            const tenantRepository = connection.getRepository(Tenant);
            const tenants = await tenantRepository.find();


            //Assert
            expect(tenants).toHaveLength(0);
           
            
        })






    })






      describe("Not given all fields", ()=>{

        it("should return a 400 status code", async()=>{
             //AAA formula
            // Arrange, Act, Assert
            const tenantData = {
               name: "tenant Name",
               address: ""
            }

            //Act
            const response = await request(app)
            .post("/tenants")
            .set('Cookie', [`accessToken=${adminToken}`])
            .send(tenantData)

            //Assert
            expect(response.statusCode).toBe(400)
        })



        



    })

})