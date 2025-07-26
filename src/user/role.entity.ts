import { Prop, Schema } from "@nestjs/mongoose";
import { UserRoles } from "./user.enum";
export class Role {
    role: UserRoles;
    organizationId?: string;
}