import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type InventoryItemDocument = InventoryItem & Document;

@Schema({collection: 'inventory_item'})
export class InventoryItem {
    @Prop({ required: true })
    productId: String;
    @Prop({ required: true })
    outletId: String;
    @Prop()
    quantity: number;
}

export const InventoryItemSchema = SchemaFactory.createForClass(InventoryItem);