import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UnitDocument = Unit & Document;

@Schema({collection:'unit', timestamps: true })
export class Unit {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  symbol: string;

  @Prop({ type: Number, required: false })
  conversionFactor?: number; 

  @Prop({ type: String, ref: 'Unit', required: false })
  parent?: string; 

  @Prop({ type: String, required: true })
  organizationId: string;
}

export const UnitSchema = SchemaFactory.createForClass(Unit);
