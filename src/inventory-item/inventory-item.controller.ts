import { Body, Controller, Get, InternalServerErrorException, Param, Patch, Post } from '@nestjs/common';
import { InventoryItemService } from './inventory-item.service';
import { AddInventoryItemDto } from './inventoty-item.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('inventory-item')
export class InventoryItemController {
    constructor(private readonly _inventoryItemService: InventoryItemService) {}
    
    @Post()
    @ApiOperation({ summary: 'Add a new InventoryItem' })
    async addInventoryItem(@Body() addInventoryItem: AddInventoryItemDto) {
        return await this._inventoryItemService.addInventoryItem(addInventoryItem);
    }

    @Patch(':id/:quantity')
    @ApiOperation({ summary: 'Update available quantity of an InventoryItem' })
    async updateAvailableQuantity(@Param('id') id: number, @Param('quantity') quantity: number) {
        return await this._inventoryItemService.updateAvailableQuantity(id, quantity);
    }

    @Get(':outletId')
    @ApiOperation({ summary: 'Get all inventory items for an outlet' })
    async getInventoryItemsByOutlet(@Param('outletId') outletId: number) {
        const inventoryItems = await this._inventoryItemService.getInventoryItemsByOutlet(outletId);
        return { status: 200, message: 'Inventory items retrieved successfully', data: inventoryItems };
    }

    @Get(':productId/:outletId')
    @ApiOperation({ summary: 'Get inventory item by product and outlet' })
    async getInventoryItemByProductAndOutlet(@Param('productId') productId: number, @Param('outletId') outletId: number) {
        const inventoryItem = await this._inventoryItemService.getIventoryItemByOutletAndProduct(productId, outletId);
        return { status: 200, message: 'Inventory item retrieved successfully', data: inventoryItem };
    }
}
