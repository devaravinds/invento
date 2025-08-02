import { ApiProperty } from "@nestjs/swagger";

export class AddInventoryItemDto {
    @ApiProperty()
    quantity: number;
    @ApiProperty()
    productId: string;
    @ApiProperty()
    outletId: string;
}

export class InventoryItemResponseDto {
    @ApiProperty()
    productId: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    quantityAvailable: number;

    @ApiProperty({ required: false })
    description?: string;
}