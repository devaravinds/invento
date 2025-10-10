import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type InventoryItemDocument = InventoryItem & Document;

@Schema({collection: 'inventory_item', timestamps: true})
export class InventoryItem {
    @Prop({ required: true })
    productId: String;
    @Prop({ required: true })
    outletId: String;
    @Prop({ required: false, default: [] , type: Array})
    quantities: Quantity[];
}

@Schema({_id: false})
export class Quantity {
    @Prop({ required: true })
    count: number;
    @Prop({ required: true })
    unit: string;
}

export const InventoryItemSchema = SchemaFactory.createForClass(InventoryItem);