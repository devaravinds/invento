import { ApiProperty } from "@nestjs/swagger";

export class AddUnitDto {
    @ApiProperty()
    name: string;
    @ApiProperty()
    symbol: string;
    @ApiProperty()
    conversionFactor?: number;
    @ApiProperty()
    parent?: string;
}

export class UnitResponseDto {
    id: string;
    name: string
    symbol: string;
    organizationId: string;
    conversionFactor?: number;
    parent?: string;
}