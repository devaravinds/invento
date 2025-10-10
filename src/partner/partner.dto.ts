import { ApiProperty } from "@nestjs/swagger";

export class AddPartnerDto {
    @ApiProperty()
    name: string;
    @ApiProperty()
    description?: string;
    @ApiProperty()
    phone?: string;
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
}