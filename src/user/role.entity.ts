import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { InvitationStatus, UserRoles } from "./user.enum";

@Schema({ _id: false })
export class Role {
    @Prop({ required: true })
    role: UserRoles;

    @Prop({ required: true })
    organizationId: string;

    @Prop({ enum: InvitationStatus })
    invitationStatus?: InvitationStatus
}
export const RoleSchema = SchemaFactory.createForClass(Role);