import { ApiProperty } from "@nestjs/swagger";

export class AddressDto {
    @ApiProperty()
    line1: string;
    @ApiProperty()
    line2?: string
    @ApiProperty()
    city: string;
    @ApiProperty()
    district: string;
    @ApiProperty()
    state: string
    @ApiProperty()
    pin: string;
}

export class BankDetailsDto {
    @ApiProperty()
    accountNumber: string
    @ApiProperty()
    ifscCode: string;
}