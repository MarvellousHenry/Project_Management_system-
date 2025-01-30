import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { userRole } from "../enum/user.role.enum";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    name: string;

  
    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: userRole.user,
        default: userRole.user
    })
    role: userRole;
}
