import { ApiProperty } from "@nestjs/swagger";

export class AddOutletDto {
    @ApiProperty({ type: String })
    organizationId: string;
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
    organizationName: string;
    @ApiProperty({ type: String })
    name: string;
    @ApiProperty({ type: String })
    address: string;
    @ApiProperty({ type: String })
    phone: string;
}