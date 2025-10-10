import { Model } from "mongoose";
import { AddTransactionDto } from "./transaction.dto";
import { Transaction, TransactionDocument } from "./transaction.entity";
import { BaseService } from "src/base/base.service";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ProductService } from "src/product/product.service";
import { OutletService } from "src/outlet/outlet.service";
import { OrganizationService } from "src/organization/organization.service";
import { TransactionStatus } from "./transaction.enum";
import { InventoryItemService } from "src/inventory-item/inventory-item.service";
import { AddInventoryItemDto } from "src/inventory-item/inventory-item.dto";
import { UnitService } from "src/unit/unit.service";
import { TransactionServiceHelper } from "./transaction.service.helper";

@Injectable()
export class TransactionService extends BaseService<TransactionDocument> {

    constructor(
        @InjectModel(Transaction.name)
        private readonly _transactionRepository: Model<TransactionDocument>,
        private readonly _productService: ProductService,
        private readonly _outletService: OutletService,
        private readonly _organizationService: OrganizationService,
        private readonly _inventoryItemService: InventoryItemService,
        private readonly _unitService: UnitService
    ) {
        super(_transactionRepository);
    }

    async addTransaction(organizationId: string, addTransactionDto: AddTransactionDto) {
        const { productId, outletId, partnerId, rate, transactionType } = addTransactionDto;
        let { quantity } = addTransactionDto;
        
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
            this._inventoryItemService.getInventoryItemByOutletAndProduct(outletId, productId),
            this._unitService.getParentTree(quantity.unit),
        ]);

        if (!inventoryItem) {
            if (parentTree.length > 1) {
                quantity = TransactionServiceHelper.convertToTopLevelUnit(quantity, parentTree);
            }
            const newInventoryItem: AddInventoryItemDto = {
                productId,
                outletId,
                quantities: [quantity]
            }
            await this._inventoryItemService.addInventoryItem(newInventoryItem);
        }
        else {
            const existingQuantities = inventoryItem.quantityAvailable;
            if (parentTree.length > 1) {
                quantity = TransactionServiceHelper.convertToTopLevelUnit(quantity, parentTree);
            }
            existingQuantities.forEach(existingQuantity => {
                if(existingQuantity.unit === quantity.unit) {
                    existingQuantity.count += quantity.count;
                }
            })
            await this._inventoryItemService.updateAvailableQuantity(inventoryItem.id, existingQuantities);
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