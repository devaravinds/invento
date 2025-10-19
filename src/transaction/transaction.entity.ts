import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { TransactionStatus, TransactionType } from "./transaction.enum";
import { Document } from "mongoose";
import { Quantity } from "src/inventory/inventory.entity";

export type TransactionDocument = Transaction & Document;

@Schema({collection: 'transaction', timestamps: true})
export class Transaction {
    @Prop({ required: true })
    rate: number;
    @Prop({ required: true })
    productId: string;
    @Prop({ required: true })
    partnerId: string;
    @Prop({ required: true })
    outletId: string;
    @Prop({ required: true })
    quantity: Quantity;    
    @Prop({ required: true, enum: TransactionStatus })
    transactionStatus: TransactionStatus
    @Prop({ required: true, enum: TransactionType })
    transactionType: TransactionType;
    @Prop()
    dueDate?: Date;
    @Prop()
    paidOn?: Date;
    @Prop()
    amount?: number;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

TransactionSchema.pre<Transaction>('save', function (next) {
  this.amount = this.rate * this.quantity.count;
  next();
});