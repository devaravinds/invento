import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type OrganizationDocument = Organization & Document;

@Schema({ collection: 'organization', timestamps: true })
export class Organization {
    @Prop({ required: true })
    name: string;
    @Prop({ required: true, unique: true })
    phone: string;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
