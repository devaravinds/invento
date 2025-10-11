import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { AddInventoryItemDto, InventoryItemResponseDto, QuantityDto } from './inventory-item.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InventoryItem, InventoryItemDocument, Quantity } from './inventory-item.entity';
import { ProductService } from 'src/product/product.service';
import { OutletService } from 'src/outlet/outlet.service';
import { BaseService } from 'src/base/base.service';

@Injectable()
export class InventoryItemService extends BaseService<InventoryItemDocument> {
    constructor(
        @InjectModel(InventoryItem.name)
        private readonly _inventoryItemRepository: Model<InventoryItemDocument>,
        private readonly _productService: ProductService ,
        private readonly _outletService: OutletService
        
    ) {
        super(_inventoryItemRepository);
    }

    async addInventoryItem(addInventoryItem: AddInventoryItemDto) {
        const { productId, outletId, quantities } = addInventoryItem;
        const productExists = await this._productService.checkExists(productId);
        const outletExists = await this._outletService.checkExists(outletId);
        if (!productExists) {
            throw new BadRequestException(`Product with ID ${productId} does not exist.`);
        }
        if (!outletExists) {
            throw new BadRequestException(`Outlet with ID ${outletId} does not exist.`);
        }
        const existingInventoryItem = await this._inventoryItemRepository.findOne({ productId: productId, outletId: outletId });
        if (existingInventoryItem) {
            try {
                const existingQuantities = existingInventoryItem.quantities;
                quantities.forEach(newQty => {
                    const existingQty = existingQuantities.find(qty => qty.unit === newQty.unit);
                    if (existingQty) {
                        newQty.count += existingQty.count;
                    }
                })
                const updatedInventoryItem = await this._inventoryItemRepository.updateOne({ productId, outletId }, { $set: { quantities: quantities } });
                return { status: 200, message: 'Inventory item updated successfully', id: updatedInventoryItem.upsertedId };
            }
            catch (error) {
                throw new InternalServerErrorException(`Error updating inventory item: ${error.message}`);
            }
        }
        const newInventoryItem = new this._inventoryItemRepository(addInventoryItem);
        try {
            const createdInventoryItem = await newInventoryItem.save();
            return { status: 201, message: 'Inventory item created successfully', id: createdInventoryItem._id };
        } catch (error) {
            throw new InternalServerErrorException(`Error creating inventory item: ${error.message}`);
        }
    }

    async updateAvailableQuantity(id: string, quantities: QuantityDto[]) {
        try {
            const updatedInventoryItem = await this._inventoryItemRepository.findByIdAndUpdate(id, { quantities: quantities });
            if (!updatedInventoryItem) {
                throw new BadRequestException(`Inventory item with ID ${id} does not exist.`);
            }
            return { status: 200, message: 'Inventory item quantity updated successfully', id: updatedInventoryItem._id };
        } catch (error) {
            throw new InternalServerErrorException(`Error updating inventory item quantity: ${error.message}`);
        }
    }

    async getInventoryItemsByOutlet(outletId: string): Promise<InventoryItemResponseDto[]> {
        try {
            const inventoryItems = await this._inventoryItemRepository.find({ outletId });
            if (!inventoryItems || inventoryItems.length === 0) {
                throw new BadRequestException(`No inventory items found for outlet ID ${outletId}.`);
            }
            const productIds = inventoryItems.map(item => item.productId);
            try {
                const products = await this._productService.getProductsByIds(productIds);
                const inventoryItemsWithProductInfo: InventoryItemResponseDto[] = inventoryItems.map(item => {
                const product = products.find(product => product.id === item.productId.toString());
                    return {
                        id: item._id.toString(),
                        productId: product.id,
                        name: product.name,
                        quantityAvailable: item.quantities
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

    async getInventoryItemByOutletAndProduct(productId: string, outletId: string): Promise<InventoryItemResponseDto> {
        let inventoryItem, product;
        try {
            inventoryItem = await this._inventoryItemRepository.findOne({ outletId, productId });
        }
        catch(error) {
            throw new InternalServerErrorException(`Error retrieving inventory item for product ID ${productId} and outlet ID ${outletId}: ${error.message}`);
        }
        if (!inventoryItem) {
            return null;
        }
        try {
            product = await this._productService.getProductById(productId);
        }
        catch(error) {
            throw new InternalServerErrorException(`Error retrieving product for product ID ${productId}: ${error.message}`);
        }
        const inventoryItemWithProductInfo: InventoryItemResponseDto = {
            id: inventoryItem._id.toString(),
            productId: product.id,
            name: product.name,
            quantityAvailable: inventoryItem.quantities,
            description: product.description
        };
        return inventoryItemWithProductInfo;
    }
}
