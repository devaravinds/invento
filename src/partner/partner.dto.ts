import { ApiProperty } from "@nestjs/swagger";
import { AddressDto } from "src/common/common.dto";
export class AddPartnerDto {
    @ApiProperty()
    name: string;
    @ApiProperty()
    description: string;
    @ApiProperty()
    phone: string;
    @ApiProperty()
    address: AddressDto
    @ApiProperty()
    gstNumber: string;
}

export class PartnerResponseDto {
    @ApiProperty()
    id: string;
    @ApiProperty()
    name: string;
    @ApiProperty()
    description: string;
    @ApiProperty()
    phone: string;
    @ApiProperty()
    address: AddressDto
    @ApiProperty()
    gstNumber: string;
}