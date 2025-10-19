import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { AddInventoryItemDto, QuantityDto } from './inventory.dto';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/authentication/authentication.guard';

@Controller('inventory')
@ApiTags('Inventory APIs')
@ApiHeader({ name: 'organization-id', required: true, description: 'Organization ID' })
@UseGuards(AuthGuard)
@ApiBearerAuth('bearer')
export class InventoryController {
    constructor(private readonly _inventoryService: InventoryService) {}
    
    @Post()
    @ApiOperation({ summary: 'Add a new Inventory item' })
    async addInventoryItem(@Body() addInventoryItem: AddInventoryItemDto) {
        return await this._inventoryService.addInventoryItem(addInventoryItem);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update available quantity of an Inventory Item' })
    async updateAvailableQuantity(@Param('id') id: string, @Body() quantity: QuantityDto[]) {
        return await this._inventoryService.updateAvailableQuantity(id, quantity);
    }

    @Get(':outletId')
    @ApiOperation({ summary: 'Get Inventory of an outlet' })
    async getInventoryByOutlet(@Param('outletId') outletId: string) {
        const inventoryItems = await this._inventoryService.getInventoryByOutlet(outletId);
        return { statusCode: 200, message: 'Inventory retrieved successfully', data: inventoryItems };
    }

    @Get(':productId/:outletId')
    @ApiOperation({ summary: 'Get Inventory by product and outlet' })
    async getInventoryByProductAndOutlet(@Param('productId') productId: string, @Param('outletId') outletId: string) {
        const inventoryItem = await this._inventoryService.getInventoryItemByOutletAndProduct(productId, outletId);
        return { statusCode: 200, message: 'Inventory item retrieved successfully', data: inventoryItem };
    }

    @Get()
    @ApiOperation({ summary: 'Get Inventory by Organization' })
    async getInventoryByOrganization(@Request() apiRequest) {
        const organizationId = apiRequest.organizationId;
        const inventory = await this._inventoryService.getInventoryByOrganization(organizationId);
        return {
            statusCode: HttpStatus.OK,
            message: "Inventory retrieved successfully",
            data: inventory
        }
    }
}
