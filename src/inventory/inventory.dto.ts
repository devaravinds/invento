import { ApiProperty } from "@nestjs/swagger";
import Decimal from "decimal.js";

export class AddInventoryItemDto {
    @ApiProperty({required: true})
    productId: string;
    @ApiProperty()
    outletId: string;
    @ApiProperty({isArray: true})
    quantities?: QuantityDto[];
}

export class QuantityDto {
    @ApiProperty()
    count: number;
    @ApiProperty()
    unit: string;
}

export class DecimalQuantity {
    @ApiProperty()
    count: Decimal;
    @ApiProperty()
    unit: string;
}

export class InventoryResponseDto {
    @ApiProperty()
    id: string;
    
    @ApiProperty()
    productId: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    quantityAvailable: QuantityResponseDto[];

    @ApiProperty({ required: false })
    description?: string;
}

export class QuantityResponseDto {
    @ApiProperty()
    unit: string

    @ApiProperty()
    count: number;

    @ApiProperty()
    unitName: string;
    
    @ApiProperty()
    unitSymbol: string;
}