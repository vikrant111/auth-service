import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

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


}
