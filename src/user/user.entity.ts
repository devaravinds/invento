import { Base } from "src/base/base.entity";
import { Role } from "./role.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('user')
export class User extends Base {
    @Column()
    firstName: string;
    @Column()
    lastName: string;
    @Column({unique: true})
    phone: string;
    @Column()
    password: string;
    @Column({unique: true})
    email: string;
    @Column({ default: false })
    isSuperAdmin?: Boolean;
    @OneToMany(() => Role, role => role.user, { cascade: true })
    roles: Role[];
}