import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type PartnerDocument = Partner & Document;

@Schema({ collection: 'partner' })
export class Partner {
    @Prop({ required: true })
    name: string;
    @Prop({ required: true, unique: true })
    phone: string;
    @Prop({ required: true })
    organizationId: string;
}

export const PartnerSchema = SchemaFactory.createForClass(Partner);
