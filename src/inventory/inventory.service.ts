import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { AddInventoryItemDto, InventoryResponseDto, QuantityDto, QuantityResponseDto } from './inventory.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inventory, InventoryDocument, Quantity } from './inventory.entity';
import { ProductService } from 'src/product/product.service';
import { OutletService } from 'src/outlet/outlet.service';
import { BaseService } from 'src/base/base.service';
import { UnitService } from 'src/unit/unit.service';

@Injectable()
export class InventoryService extends BaseService<InventoryDocument> {
    constructor(
        @InjectModel(Inventory.name)
        private readonly _inventoryRepository: Model<InventoryDocument>,
        private readonly _productService: ProductService ,
        private readonly _outletService: OutletService,
        private readonly _unitService: UnitService,
        
    ) {
        super(_inventoryRepository);
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
        const existingInventoryItem = await this._inventoryRepository.findOne({ productId: productId, outletId: outletId });
        if (existingInventoryItem) {
            try {
                const existingQuantities = existingInventoryItem.quantities;
                quantities.forEach(newQty => {
                    const existingQty = existingQuantities.find(qty => qty.unit === newQty.unit);
                    if (existingQty) {
                        newQty.count += existingQty.count;
                    }
                })
                const updatedInventoryItem = await this._inventoryRepository.updateOne({ productId, outletId }, { $set: { quantities: quantities } });
                return { status: 200, message: 'Inventory item updated successfully', id: updatedInventoryItem.upsertedId };
            }
            catch (error) {
                throw new InternalServerErrorException(`Error updating inventory item: ${error.message}`);
            }
        }
        const newInventoryItem = new this._inventoryRepository(addInventoryItem);
        try {
            const createdInventoryItem = await newInventoryItem.save();
            return { status: 201, message: 'Inventory item created successfully', id: createdInventoryItem._id };
        } catch (error) {
            throw new InternalServerErrorException(`Error creating inventory item: ${error.message}`);
        }
    }

    async updateAvailableQuantity(id: string, quantities: QuantityDto[]) {
        try {
            const updatedInventoryItem = await this._inventoryRepository.findByIdAndUpdate(id, { quantities: quantities });
            if (!updatedInventoryItem) {
                throw new BadRequestException(`Inventory item with ID ${id} does not exist.`);
            }
            return { status: 200, message: 'Inventory item quantity updated successfully', id: updatedInventoryItem._id };
        } catch (error) {
            throw new InternalServerErrorException(`Error updating inventory item quantity: ${error.message}`);
        }
    }

    async getInventoryByOutlet(outletId: string): Promise<InventoryResponseDto[]> {
        try {
            const inventory = await this._inventoryRepository.find({ outletId });
            if (!inventory || inventory.length === 0) {
                throw new BadRequestException(`No inventory items found for outlet ID ${outletId}.`);
            }
            const productIds = inventory.map(item => item.productId);
            const unitIds = inventory.flatMap(item => item.quantities.flatMap(quantity => quantity.unit))
            try {
                const products = await this._productService.getProductsByIds(productIds);
                const units = await this._unitService.getUnitByIds(unitIds)
                const inventoryWithProductInfo: InventoryResponseDto[] = inventory.map(item => {
                    const product = products.find(product => product.id === item.productId.toString());
                    const quantityAvailable: QuantityResponseDto[] = item.quantities.map(quantity => {
                        const unit = units.find(unit => unit.id == quantity.unit)
                        return {
                            unit: unit.id,
                            count: quantity.count,
                            unitName: unit.name,
                            unitSymbol: unit.symbol
                        }
                    })
                        return {
                            id: item._id.toString(),
                            productId: product.id,
                            name: product.name,
                            quantityAvailable: quantityAvailable
                        };
                });
                return inventoryWithProductInfo;
            }
            catch (error) {
                throw new InternalServerErrorException(`Error retrieving products for outlet ID ${outletId}: ${error.message}`);
            }
        }
        catch (error) {
            throw new InternalServerErrorException(`Error retrieving inventory: ${error.message}`);
        }
    }

    async getInventoryItemByOutletAndProduct(productId: string, outletId: string): Promise<InventoryResponseDto> {
        let inventoryItem, product;
        try {
            inventoryItem = await this._inventoryRepository.findOne({ outletId, productId });
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
        const inventoryWithProductInfo: InventoryResponseDto = {
            id: inventoryItem._id.toString(),
            productId: product.id,
            name: product.name,
            quantityAvailable: inventoryItem.quantities,
            description: product.description
        };
        return inventoryWithProductInfo;
    }

    async getInventoryByOrganization(organizationId: string): Promise<InventoryResponseDto[]> {
        try {
            const outlets = await this._outletService.getOutletsByOrganization(organizationId);
            const inventory = await this._inventoryRepository.find({ outletId: {$in: outlets.map(outlet => outlet.id)} });
            const productIds = inventory.map(item => item.productId);
            const unitIds = inventory.flatMap(item => item.quantities.flatMap(quantity => quantity.unit))
            const products = await this._productService.getProductsByIds(productIds);
            const units = await this._unitService.getUnitByIds(unitIds)
            const inventoryWithProductInfo: InventoryResponseDto[] = inventory.map(item => {
                const product = products.find(product => product.id === item.productId.toString());
                const quantityAvailable: QuantityResponseDto[] = item.quantities.map(quantity => {
                    const unit = units.find(unit => unit.id == quantity.unit)
                    return {
                        unit: unit.id,
                        count: quantity.count,
                        unitName: unit.name,
                        unitSymbol: unit.symbol
                    }
                })
                    return {
                        id: item._id.toString(),
                        productId: product.id,
                        name: product.name,
                        quantityAvailable: quantityAvailable
                    };
            });
            return inventoryWithProductInfo;
        } catch (error) {
            throw new InternalServerErrorException(`Error retrieving inventory. Error: ${error.message}`);
        }
    }
}
