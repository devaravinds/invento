import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { AddInventoryItemDto, InventoryItemResponseDto } from './inventoty-item.dto';
import { InventoryItem } from './inventory-item.entity';
import { ProductService } from 'src/product/product.service';
import { OutletService } from 'src/outlet/outlet.service';
import { BaseService } from 'src/base/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class InventoryItemService extends BaseService<InventoryItem> {
    constructor(
        @InjectRepository(InventoryItem)
        private readonly _inventoryItemRepository: Repository<InventoryItem>,
        private readonly _productService: ProductService,
        private readonly _outletService: OutletService

    ) {
        super(_inventoryItemRepository);
    }

    async addInventoryItem(addInventoryItem: AddInventoryItemDto) {
        const { productId, outletId } = addInventoryItem;
        const productExists = await this._productService.checkExists(productId);
        const outletExists = await this._outletService.checkExists(outletId);
        if (!productExists) {
            throw new BadRequestException(`Product with ID ${productId} does not exist.`);
        }
        if (!outletExists) {
            throw new BadRequestException(`Outlet with ID ${outletId} does not exist.`);
        }
        const productOutletQuery = {
            product: { id: productId },
            outlet: { id: outletId }
        }
        const existingInventoryItem = await this._inventoryItemRepository.exists({
            where: productOutletQuery
        });
        if (existingInventoryItem) {
            try {
                const updatedInventoryItem = await this._inventoryItemRepository.increment(productOutletQuery, 'quantity', addInventoryItem.quantity);
                return { status: 200, message: 'Inventory item updated successfully', id: updatedInventoryItem.raw.id };
            }
            catch (error) {
                throw new InternalServerErrorException(`Error updating inventory item: ${error.message}`);
            }
        }
        try {
            const createdInventoryItem = await this._inventoryItemRepository.save(addInventoryItem)
            return { status: 201, message: 'Inventory item created successfully', id: createdInventoryItem.id };
        } catch (error) {
            throw new InternalServerErrorException(`Error creating inventory item: ${error.message}`);
        }
    }

    async updateAvailableQuantity(id: number, quantity: number) {
        try {
            const updatedInventoryItem = await this._inventoryItemRepository.update(id, { quantity });
            if (!updatedInventoryItem) {
                throw new BadRequestException(`Inventory item with ID ${id} does not exist.`);
            }
            return { status: 200, message: 'Inventory item quantity updated successfully', id: updatedInventoryItem.raw.id };
        } catch (error) {
            throw new InternalServerErrorException(`Error updating inventory item quantity: ${error.message}`);
        }
    }

    async getInventoryItemsByOutlet(outletId: number): Promise<InventoryItemResponseDto[]> {
        try {
            const inventoryItems = await this._inventoryItemRepository.find({ where: { outlet: { id: outletId } }, relations: ['product'] });
            if (!inventoryItems || inventoryItems.length === 0) {
                throw new BadRequestException(`No inventory items found for outlet ID ${outletId}.`);
            }
            const productIds = inventoryItems.map(item => item.product.id);
            try {
                const products = inventoryItems.map(item => item.product);
                const inventoryItemsWithProductInfo: InventoryItemResponseDto[] = inventoryItems.map(item => {
                    const product = products.find(product => product.id === item.product.id);
                    return {
                        productId: product.id,
                        name: product.name,
                        quantityAvailable: item.quantity
                    };
                });
                return inventoryItemsWithProductInfo;
            }
            catch (error) {
                throw new InternalServerErrorException(`Error retrieving products for outlet ID ${outletId}: ${error.message}`);
            }
        }
        catch (error) {
            throw new InternalServerErrorException(`Error retrieving inventory items: ${error.message}`);
        }
    }

    async getIventoryItemByOutletAndProduct(productId: number, outletId: number): Promise<InventoryItemResponseDto> {
        const productOutletQuery = {
            product: { id: productId },
            outlet: { id: outletId }
        }
        try {
            const inventoryItem = await this._inventoryItemRepository.findOne({where: productOutletQuery});
            if (!inventoryItem) {
                throw new BadRequestException(`Inventory item with product ID ${productId} does not exist for outlet ID ${outletId}.`);
            }
            try {
                const product = await this._productService.getProductById(productId);
                const inventoryItemWithProductInfo: InventoryItemResponseDto = {
                    productId: product.id,
                    name: product.name,
                    quantityAvailable: inventoryItem.quantity,
                    description: product.description
                };
                return inventoryItemWithProductInfo;
            }
            catch (error) {
                throw new InternalServerErrorException(`Error retrieving product for product ID ${productId}: ${error.message}`);
            }
        }
        catch (error) {
            throw new InternalServerErrorException(`Error retrieving inventory item for product ID ${productId} and outlet ID ${outletId}: ${error.message}`);
        }
    }
}
