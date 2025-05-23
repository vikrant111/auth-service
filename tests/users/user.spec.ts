import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import request from "supertest";
import app from "../../src/app";
import createJWKSMock from "mock-jwks";
import { User } from "../../src/entity/User";
import { Roles } from "../../src/constants";


describe("GET /auth/self", () => {
  let connection: DataSource;
      let jwks: ReturnType<typeof createJWKSMock>;

  beforeAll(async () => {
    jwks = createJWKSMock('http://localhost:5501')
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
       jwks.start();
    // need to clean the database before each test run
    await connection.dropDatabase();
    await connection.synchronize();
    //    await truncateTables(connection)
  });



    afterEach(async ()=>{
        jwks.stop();
    })
    
  

  afterAll(async () => {
    await connection.destroy();
  });




  describe("Given all fields", () => {
    it("should return the 200 status code", async () => {
          // generete token 
      const accessToken = jwks.token({sub: String(1), role: Roles.ADMIN})
      const response = await request(app)
      .get("/auth/self")
      .set('Cookie', [`accessToken= ${accessToken};`])
      .send();
      expect(response.statusCode).toBe(200);
    });



     it("should return the user data", async () => {
        //register user in database
        const userData = {
            firstName:"Vikrant",
            lastName: "tiwari",
            email: "vikrant@gmail.com",
            password: "345679secret"
        }
        const userRepository = connection.getRepository(User);
        const data = await userRepository.save({...userData, role:Roles.ADMIN })


        // generete token 
        const accessToken = jwks.token({sub: String(data.id), role: data.role})

        // add token to cookie
      const response = await request(app).get("/auth/self")
      .set('Cookie', [`accessToken=${accessToken};`])
      .send();
     
      //Assert
      //Chenk if the user id matches with the registered user
      expect((response.body as Record<string, string>).id).toBe(data.id)
      
    });



      it("should not return the password field", async () => {
        // register user in database
        const userData = {
            firstName:"Vikrant",
            lastName: "tiwari",
            email: "vikrant@gmail.com",
            password: "345679secret"
        }
        const userRepository = connection.getRepository(User);
        const data = await userRepository.save({...userData, role:Roles.ADMIN })


        // generete token 
        const accessToken = jwks.token({sub: String(data.id), role: data.role})

        // add token to cookie
      const response = await request(app).get("/auth/self")
      .set('Cookie', [`accessToken=${accessToken};`])
      .send();
     
      //Assert
      //Chenk if the user id matches with the registered user
      expect(response.body as Record<string, string>).not.toHaveProperty("password")
      
    });



    
      it("should return 401 status code if token does not exists", async () => {
        // register user in database
        const userData = {
            firstName:"Vikrant",
            lastName: "tiwari",
            email: "vikrant@gmail.com",
            password: "345679secret"
        }
        const userRepository = connection.getRepository(User);
         await userRepository.save({...userData, role:Roles.ADMIN })


        // generete token 
        // const accessToken = jwks.token({sub: String(data.id), role: data.role})

        // add token to cookie
      const response = await request(app).get("/auth/self").send();
     
      //Assert
      //Chenk if the user id matches with the registered user
      expect(response.statusCode).toBe(401)
      
    });



  });




});