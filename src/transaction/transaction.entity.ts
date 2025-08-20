import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { TransactionStatus, TransactionType } from "./transaction.enum";
import { Document } from "mongoose";

export type TransactionDocument = Transaction & Document;

@Schema({collection: 'transaction'})
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
    count: number;    
    @Prop({ required: true, enum: TransactionStatus })
    transactionStatus: TransactionStatus
    @Prop({ required: true, enum: TransactionType })
    transactionType: TransactionType;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);