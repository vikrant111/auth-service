import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Tenant } from "./Tenant";

@Entity({
    name:"users"
})
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    role: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({unique: true})
    email: string;

    //{select: false} means whenever we will fetch this user record password will not come 
    @Column()
    password: string;

    // adding the id(primary key for tenant table) of tenant from tenant table
    // as a foreign key to the users table 

    //Many users can have one Tenant
    //Example- Many users(Managers) can register to one restraunt

    @ManyToOne(()=>Tenant)
    tenant: Tenant
}
