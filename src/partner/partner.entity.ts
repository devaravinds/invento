import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Address } from "src/common/common.entity";

export type PartnerDocument = Partner & Document;
@Schema({ collection: 'partner', timestamps: true })
export class Partner {
    @Prop({ required: true })
    name: string;
    @Prop({ required: true })
    organizationId: string;
    @Prop()
    description: string;
    @Prop({ unique: true })
    phone: string;
    @Prop()
    address: Address;
    @Prop()
    gstNumber: string;
}

export const PartnerSchema = SchemaFactory.createForClass(Partner);
