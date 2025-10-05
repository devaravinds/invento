import { ApiProperty } from "@nestjs/swagger";

export class AddOutletDto {
    @ApiProperty({ type: Number })
    organizationId: number;
    @ApiProperty({ type: String })
    name: string;
    @ApiProperty({ type: String })
    address: string;
    @ApiProperty({ type: String })
    phone: string;
}

export class OutletResponseDto {
    @ApiProperty({ type: Number })
    id: number;
    @ApiProperty({ type: String })
    organizationName: string;
    @ApiProperty({ type: String })
    name: string;
    @ApiProperty({ type: String })
    address: string;
    @ApiProperty({ type: String })
    phone: string;
}