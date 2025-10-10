import { ApiProperty } from "@nestjs/swagger";

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

export class InventoryItemResponseDto {
    @ApiProperty()
    id: string;
    
    @ApiProperty()
    productId: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    quantityAvailable: QuantityDto[];

    @ApiProperty({ required: false })
    description?: string;
}