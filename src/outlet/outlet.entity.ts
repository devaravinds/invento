import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export type OutletDocument = Outlet & Document;

@Schema({collection: 'outlet'})
export class Outlet {
    @Prop({ required: true })
    name: string;
    @Prop({ required: true, unique: true })
    phone: string;
    @Prop({ required: true })
    address: string;
    @Prop({ type: String, ref: 'Organization', required: true })
    organizationId: string; 
}

export const OutletSchema = SchemaFactory.createForClass(Outlet);