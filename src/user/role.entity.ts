import { Base } from "src/base/base.entity";
import { InvitationStatus, UserRoles } from "./user.enum";
import { Column, Entity, ManyToOne } from "typeorm";
import { User } from "./user.entity";
import { Organization } from "src/organization/organization.entity";

@Entity('role')
export class Role extends Base {
    @Column()
    role: UserRoles;

    @ManyToOne(() => Organization, (org) => org.roles, { onDelete: 'CASCADE' })
    organization: Organization;

    @Column({ enum: InvitationStatus })
    invitationStatus: InvitationStatus

    @ManyToOne(() => User, (user) => user.roles, { onDelete: 'CASCADE' })
    user: User;
}