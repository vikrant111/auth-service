import bcrypt from "bcrypt";



export class CredentialService{
    async comparePassword(userPassword: string, dbPassword: string){
        return await bcrypt.compare(userPassword, dbPassword);
    }
}