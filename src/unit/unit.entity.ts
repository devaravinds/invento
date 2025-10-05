import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UnitDocument = Unit & Document;

@Schema({collection:'unit', timestamps: true })
export class Unit {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  symbol: string;

  @Prop({ type: Number, required: false, default: 1 })
  conversionFactor: number; 

  @Prop({ type: String, ref: 'Unit', required: false })
  parent?: string; 
}

export const UnitSchema = SchemaFactory.createForClass(Unit);
