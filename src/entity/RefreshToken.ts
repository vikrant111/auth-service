import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { User } from "./User";

@Entity({
    name: "refreshTokens"
})
export class RefreshToken {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'timestamp'})
    expiresAt: Date

    // TypeORM automatically generates a foreign key column using the name of the property (user)
    // plus the primary key of the related entity (id in User). So: The resulting column in the database will be: ((((-----userId------))))

    // TypeORM uses a naming strategy to form the foreign key:
    // <propertyName><ReferencedColumnName>
    // = user + id
    // = userId



    // 🔸 @ManyToOne(() => User) user: User
    // This is a many-to-one relationship with the User entity.

    // Meaning: Many refresh tokens can belong to one user.

    // A foreign key is created in this table pointing to the User table.


    @ManyToOne(()=>User)
    user: User
    
    
    @UpdateDateColumn()
    updatedAt: number;

    @CreateDateColumn()
    createdAt: number;
    


}
