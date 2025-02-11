import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Todo {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    created_at: Date;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    userId: string;

    
    @ManyToOne(() => User, (user) => user.todo)
    user: User;


}

