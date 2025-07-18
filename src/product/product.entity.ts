import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ProductDocument = Product & Document;

@Schema({collection: 'product'})
export class Product {
    @Prop({ required: true })
    name: string;
    @Prop({ required: true })
    price: number;
    @Prop({ required: true })
    description: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);