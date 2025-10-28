import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Address, BankDetails } from "src/common/common.entity";

export type OrganizationDocument = Organization & Document;

@Schema({ collection: 'organization', timestamps: true })
export class Organization {
    @Prop({ required: true })
    name: string;
    @Prop({ required: true, unique: true })
    phone: string;
    @Prop({ unique: true })
    gstNumber: string;
    @Prop()
    address: Address;
    @Prop()
    bankDetails: BankDetails;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
