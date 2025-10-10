import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ProductDocument = Product & Document;

@Schema({collection: 'product', timestamps: true})
export class Product {
    @Prop({ required: true })
    name: string;
    @Prop({ required: true })
    description: string;
    @Prop({ required: true })
    organizationId: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);