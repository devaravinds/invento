import { ApiProperty } from "@nestjs/swagger";

export class AddInventoryItemDto {
    @ApiProperty()
    quantity: number;
    @ApiProperty()
    productId: number;
    @ApiProperty()
    outletId: number;
}

export class InventoryItemResponseDto {
    @ApiProperty()
    productId: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    quantityAvailable: number;

    @ApiProperty({ required: false })
    description?: string;
}