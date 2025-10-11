import { Model } from "mongoose";
import { AddTransactionDto } from "./transaction.dto";
import { Transaction, TransactionDocument } from "./transaction.entity";
import { BaseService } from "src/base/base.service";
import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ProductService } from "src/product/product.service";
import { OutletService } from "src/outlet/outlet.service";
import { OrganizationService } from "src/organization/organization.service";
import { TransactionStatus, TransactionType } from "./transaction.enum";
import { InventoryService } from "src/inventory/inventory.service";
import { AddInventoryItemDto, QuantityDto } from "src/inventory/inventory.dto";
import { UnitService } from "src/unit/unit.service";
import { TransactionServiceHelper } from "./transaction.service.helper";
import Decimal from "decimal.js";
import { count } from "console";

@Injectable()
export class TransactionService extends BaseService<TransactionDocument> {

    constructor(
        @InjectModel(Transaction.name)
        private readonly _transactionRepository: Model<TransactionDocument>,
        private readonly _productService: ProductService,
        private readonly _outletService: OutletService,
        private readonly _organizationService: OrganizationService,
        private readonly _inventoryService: InventoryService,
        private readonly _unitService: UnitService
    ) {
        super(_transactionRepository);
    }

    async addTransaction(organizationId: string, addTransactionDto: AddTransactionDto) {
        const { productId, outletId, partnerId, rate, transactionType, quantity } = addTransactionDto;

        let decimalQuantity = {
            unit: quantity.unit,
            count: new Decimal(quantity.count)
        }
        
        const product = await this._productService.getById(productId);
        if (!product || product.organizationId !== organizationId) {
            throw new BadRequestException(`Product with ID ${productId} does not exist.`);
        }

        const outlet = await this._outletService.getById(outletId);
        if (!outlet || outlet.organizationId !== organizationId) {
            throw new BadRequestException(`Outlet with ID ${outletId} does not exist.`);
        }

        const organizationExists = await this._organizationService.checkExists(organizationId);
        if (!organizationExists) {
            throw new BadRequestException(`Organization with ID ${organizationId} does not exist.`);
        }

        const [inventoryItem, parentTree] = await Promise.all([
            this._inventoryService.getInventoryItemByOutletAndProduct(productId, outletId),
            this._unitService.getParentTree(decimalQuantity.unit),
        ]);

        if (!inventoryItem) {
            if(transactionType == TransactionType.SALE) {
                throw new ConflictException(`Not enough quantity available for the transaction`)
            }
            if (parentTree.length > 1) {
                decimalQuantity = TransactionServiceHelper.convertToTopLevelUnit(decimalQuantity, parentTree);
            }
            const quantityToSave: QuantityDto = {
                unit: decimalQuantity.unit,
                count: decimalQuantity.count.toNumber()
            }
            const newInventoryItem: AddInventoryItemDto = {
                productId,
                outletId,
                quantities: [quantityToSave]
            }
            await this._inventoryService.addInventoryItem(newInventoryItem);
        }
        else {
            const existingQuantities = inventoryItem.quantityAvailable;
            if (parentTree.length > 1) {
                decimalQuantity = TransactionServiceHelper.convertToTopLevelUnit(decimalQuantity, parentTree);
            }
            existingQuantities.forEach(existingQuantity => {
                if(existingQuantity.unit === decimalQuantity.unit) {
                    const decimalQuantityNumberCount = decimalQuantity.count.toNumber();
                    if(transactionType == TransactionType.PURCHASE){
                        existingQuantity.count += decimalQuantityNumberCount
                    }
                    else {
                        if(existingQuantity.count < decimalQuantityNumberCount) {
                            throw new ConflictException(`Not enough quantity available for the transaction`)
                        }
                        existingQuantity.count -= decimalQuantityNumberCount
                    }
                }
            })
            await this._inventoryService.updateAvailableQuantity(inventoryItem.id, existingQuantities);
        }
        const newTransaction: Transaction = {
            productId,
            outletId,
            partnerId,
            rate,
            quantity,
            transactionType,
            transactionStatus: TransactionStatus.PENDING
        } 
        const createdTransaction = await this._transactionRepository.create(newTransaction);
        return createdTransaction._id.toString();
    }

    async getTransactionsByOrganization(organizationId: string) {
        
    }
}