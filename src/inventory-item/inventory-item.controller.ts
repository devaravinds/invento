import { Body, Controller, Get, InternalServerErrorException, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { InventoryItemService } from './inventory-item.service';
import { AddInventoryItemDto, QuantityDto } from './inventory-item.dto';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/authentication/authentication.guard';

@Controller('inventory-items')
@ApiTags('Inventory Item APIs')
@ApiHeader({ name: 'organization-id', required: true, description: 'Organization ID' })
@UseGuards(AuthGuard)
@ApiBearerAuth('bearer')
export class InventoryItemController {
    constructor(private readonly _inventoryItemService: InventoryItemService) {}
    
    @Post()
    @ApiOperation({ summary: 'Add a new InventoryItem' })
    async addInventoryItem(@Body() addInventoryItem: AddInventoryItemDto) {
        return await this._inventoryItemService.addInventoryItem(addInventoryItem);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update available quantity of an InventoryItem' })
    async updateAvailableQuantity(@Param('id') id: string, @Body() quantity: QuantityDto[]) {
        return await this._inventoryItemService.updateAvailableQuantity(id, quantity);
    }

    @Get(':outletId')
    @ApiOperation({ summary: 'Get all inventory items for an outlet' })
    async getInventoryItemsByOutlet(@Param('outletId') outletId: string) {
        const inventoryItems = await this._inventoryItemService.getInventoryItemsByOutlet(outletId);
        return { status: 200, message: 'Inventory items retrieved successfully', data: inventoryItems };
    }

    @Get(':productId/:outletId')
    @ApiOperation({ summary: 'Get inventory item by product and outlet' })
    async getInventoryItemByProductAndOutlet(@Param('productId') productId: string, @Param('outletId') outletId: string) {
        const inventoryItem = await this._inventoryItemService.getInventoryItemByOutletAndProduct(productId, outletId);
        return { status: 200, message: 'Inventory item retrieved successfully', data: inventoryItem };
    }
}
