import { DataSource } from "typeorm"
import app from "../../src/app"
import request from "supertest"
import { AppDataSource } from "../../src/config/data-source";
import { truncateTables } from "../utils";
import { User } from "../../src/entity/User";
import { Roles } from "../../src/constants";

describe("POST /auth/register", ()=>{
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




    describe("All fields are provided", ()=>{

        it("should return the 201 status code", async()=>{

            //AAA formula
            // Arrange, Act, Assert
            const userData = {
                firstName:"Vikrant",
                lastName: "tiwari",
                email: "vikrant@gmail.com",
                password: "345679secret"
            }

            //Act
            const response = await request(app)
            .post("/auth/register")
            .send(userData)

            //Assert
            expect(response.statusCode).toBe(201)

        })

        it("should return valid json response", async()=>{
             //AAA formula
            // Arrange, Act, Assert
            const userData = {
                firstName:"Vikrant",
                lastName: "tiwari",
                email: "vikrant@gmail.com",
                password: "345679secret"
            }

            //Act
            const response = await request(app)
            .post("/auth/register")
            .send(userData)

            //Assert
            //the object is a type of record and the key is String and value is also a String
            expect((response.headers as Record<string, string>)['content-type']).toEqual(expect.stringContaining("json"))
        })

        it("should persist the user in database", async()=>{
                      //AAA formula
            // Arrange, Act, Assert
            const userData = {
                firstName:"Vikrant",
                lastName: "tiwari",
                email: "vikrant@gmail.com",
                password: "345679secret"
            }

            //Act
            const response = await request(app)
            .post("/auth/register")
            .send(userData)

            //Assert
            const userRepository = connection.getRepository(User)
            const users = await userRepository.find();
            expect(users).toHaveLength(1);
            expect(users[0].firstName).toBe(userData.firstName);
            expect(users[0].lastName).toBe(userData.lastName);
            expect(users[0].email).toBe(userData.email);

        })

        it("should return the id of the created user", async()=>{
                       //AAA formula
            // Arrange, Act, Assert
            const userData = {
                firstName:"Vikrant",
                lastName: "tiwari",
                email: "vikrant@gmail.com",
                password: "345679secret"
            }

            //Act
            const response = await request(app)
            .post("/auth/register")
            .send(userData)

            //Assert
            const userRepository = connection.getRepository(User)
            const users = await userRepository.find();
            expect(users.length).toBe(1);
            expect(users[0]).toHaveProperty("id");
            expect(typeof users[0].id).toBe("number");
        })


        it("should assign a customer role", async()=>{

                       //AAA formula
            // Arrange, Act, Assert
            const userData = {
                firstName:"Vikrant",
                lastName: "tiwari",
                email: "vikrant@gmail.com",
                password: "345679secret"
            }

            //Act
            const response = await request(app)
            .post("/auth/register")
            .send(userData)

            //Assert
            const userRepository = connection.getRepository(User)
            const users = await userRepository.find();
            expect(users[0]).toHaveProperty("role");
            expect(users[0].role).toBe(Roles.CUSTOMER);
        })

        it("should store the hashed password", async()=>{

            //AAA formula
            // Arrange, Act, Assert
            const userData = {
                firstName:"Vikrant",
                lastName: "tiwari",
                email: "vikrant@gmail.com",
                password: "345679secret"
            }

            //Act
            const response = await request(app)
            .post("/auth/register")
            .send(userData)

            //Assert
            const userRepository = connection.getRepository(User)
            const users = await userRepository.find();
            console.log("hashed password", users[0].password)
            expect(users[0]).toHaveProperty("password");
            expect(users[0].password).toHaveLength(60);
            expect(users[0].password).not.toBe(userData.password);
            expect(users[0].password).toMatch(/^\$2b\$\d+\$/);

        })

        it("should return 400 status code if the email is already registered", async()=>{
            
            //AAA formula
            // Arrange, Act, Assert
            const userData = {
                firstName:"Vikrant",
                lastName: "tiwari",
                email: "vikrant@gmail.com",
                password: "345679secret"
            }

            const userRepository = connection.getRepository(User)
            await userRepository.save({...userData, role: Roles.CUSTOMER});

            //Act
            const response = await request(app)
            .post("/auth/register")
            .send(userData)

            //Assert
    

            const users = await userRepository.find();
            expect(response.statusCode).toBe(400);
            expect(users).toHaveLength(1);


        })

    })

    describe("Fields are missing", ()=>{


    })

})