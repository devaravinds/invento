import { Prop, Schema } from "@nestjs/mongoose";

@Schema({_id: false})
export class Address {
    @Prop()
    line1: string;
    @Prop()
    line2?: string;
    @Prop()
    city: string;
    @Prop()
    district: string;
    @Prop()
    state: string;
    @Prop()
    pin: string;
}

@Schema({_id: false})
export class BankDetails {
    @Prop()
    accountNumber: string;
    @Prop()
    ifscCode: string;
}