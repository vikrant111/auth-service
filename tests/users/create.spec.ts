import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import request from "supertest";
import app from "../../src/app";
import createJWKSMock from "mock-jwks";
import { User } from "../../src/entity/User";
import { Roles } from "../../src/constants";


describe("POST /users", () => {
  let connection: DataSource;
      let jwks: ReturnType<typeof createJWKSMock>;
     let adminToken: string;

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

     adminToken = jwks.token({
            sub:"1",
            role: Roles.ADMIN
        })

  });



    afterEach(async ()=>{
        jwks.stop();
    })
    
  

  afterAll(async () => {
    await connection.destroy();
  });




  describe("Given all fields", () => {
 
    //these users are mananger users.......these users are created by the manangers
    
      it("should persdist the user un the database", async () => {
        // register user in database
        const userData = {
            firstName:"Vikrant",
            lastName: "tiwari",
            email: "vikrant@gmail.com",
            password: "345679secret",
            tenantID: 1
        }
    


        // generete token 
        // const accessToken = jwks.token({sub: String(data.id), role: data.role})

        // add token to cookie
      await request(app)
      .post("/users")
      .set('Cookie', [`accessToken=${adminToken}`])
      .send(userData);


      const userRespository = connection.getRepository(User);
      const users = await userRespository.find();

     
      //Assert
      expect(users).toHaveLength(1);
      expect(users[0].email).toBe(userData.email)
      
    });

 it("should create a manager user", async () => {
        // register user in database
        const userData = {
            firstName:"Vikrant",
            lastName: "tiwari",
            email: "vikrant@gmail.com",
            password: "345679secret",
            tenantID: 1
        }
    


        // generete token 
        // const accessToken = jwks.token({sub: String(data.id), role: data.role})

        // add token to cookie
      await request(app)
      .post("/users")
      .set('Cookie', [`accessToken=${adminToken}`])
      .send(userData);


      const userRespository = connection.getRepository(User);
      const users = await userRespository.find();

     
      //Assert
      expect(users).toHaveLength(1);
      expect(users[0].role).toBe(Roles.MANAGER)
      
    });


    
       it("should create a manager user", async () => {
        // register user in database
        const userData = {
            firstName:"Vikrant",
            lastName: "tiwari",
            email: "vikrant@gmail.com",
            password: "345679secret",
            tenantID: 1
        }
    


        // generete token 
        // const accessToken = jwks.token({sub: String(data.id), role: data.role})

        // add token to cookie
      await request(app)
      .post("/users")
      .set('Cookie', [`accessToken=${adminToken}`])
      .send(userData);


      const userRespository = connection.getRepository(User);
      const users = await userRespository.find();

     
      //Assert
      expect(users).toHaveLength(1);
      expect(users[0].role).toBe(Roles.MANAGER)
      
    });



    it.todo("should return 403 if non admin user tries to create the user")



  });



  describe("Missing fields", ()=>{
    
 it("should check for all the required fields", async () => {
        // register user in database
        const userData = {
            firstName:"",
            lastName: "tiwari",
            email: "vikrant@gmail.com",
            password: "345679secret",
            tenantID: 1
        }
    


        // generete token 
        // const accessToken = jwks.token({sub: String(data.id), role: data.role})

        // add token to cookie
      const response = await request(app)
      .post("/users")
      .set('Cookie', [`accessToken=${adminToken}`])
      .send(userData);


      // const userRespository = connection.getRepository(User);
      // const users = await userRespository.find();

     
      //Assert
    expect(response.status).toBe(400); // or whatever your validation returns
    // expect(response.body.message).toMatch(/firstName is required/i);


      // Make sure no user was inserted
    const userRepository = connection.getRepository(User);
    const users = await userRepository.find();
    expect(users).toHaveLength(0);
      
    });

  })




});