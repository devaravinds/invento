import { ApiProperty } from "@nestjs/swagger";

export class AddOutletDto {
    @ApiProperty({ type: String, required: true })
    name: string;
    @ApiProperty({ type: String, required: true })
    description: string;
    @ApiProperty({ type: String })
    address: string;
    @ApiProperty({ type: String })
    phone?: string;
}

export class OutletByPhoneResponseDto {
    @ApiProperty({ type: String })
    id: string;
    @ApiProperty({ type: String })
    organizationName: string;
    @ApiProperty({ type: String })
    name: string;
    @ApiProperty({ type: String })
    address: string;
    @ApiProperty({ type: String })
    phone: string;
}

export class OutletResponseDto {
    @ApiProperty({ type: String })
    id: string;
    @ApiProperty({ type: String })
    name: string
    @ApiProperty({ type: String })
    description: string
    @ApiProperty({ type: String })
    address: string
    @ApiProperty({ type: String })
    phone: string
}