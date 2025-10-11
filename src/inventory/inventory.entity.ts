import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type InventoryDocument = Inventory & Document;

@Schema({collection: 'inventory', timestamps: true})
export class Inventory {
    @Prop({ required: true })
    productId: string;
    @Prop({ required: true })
    outletId: string;
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

export const InventorySchema = SchemaFactory.createForClass(Inventory);