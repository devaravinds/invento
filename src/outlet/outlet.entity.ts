import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export type OutletDocument = Outlet & Document;

@Schema({collection: 'outlet'})
export class Outlet {
    @Prop({ required: true })
    name: string;
    @Prop({ required: true})
    description: string;
    @Prop({ type: String, ref: 'Organization', required: true })
    organizationId: string; 
    @Prop()
    address: string;
    @Prop({ required: true })
    phone: string;
}

export const OutletSchema = SchemaFactory.createForClass(Outlet);