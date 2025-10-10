import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Role } from "./role.entity";
import { Document } from "mongoose";

export type UserDocument = User & Document;

@Schema({collection: 'user', timestamps: true})
export class User {
    @Prop({ required: true })
    firstName: string;
    @Prop({ required: true })
    lastName: string;
    @Prop({ required: true, unique: true })
    phone: string;
    @Prop({ required: true })
    password: string;
    @Prop({ required: false, unique: true })
    email?: string;
    @Prop({type: [Role], default: []})
    roles?: Role[];
    @Prop()
    isSuperAdmin?: Boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);