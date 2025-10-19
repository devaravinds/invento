import { Model } from "mongoose";
import { AddTransactionDto, SingleTransactionResponseDto, TransactionResponseDto } from "./transaction.dto";
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
        const { productId, outletId, partnerId, rate, transactionType, quantity, transactionStatus, dueDate, paidOn } = addTransactionDto;

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
            transactionStatus,
            dueDate,
            paidOn
        } 
        const createdTransaction = await this._transactionRepository.create(newTransaction);
        return createdTransaction._id.toString();
    }

    async deleteTransactionById( transactionId: string) {
        const transaction = await this._transactionRepository.findById(transactionId);
        if(!transaction) {
            throw new BadRequestException(`Transaction with ID ${transactionId} does not exist.`);
        }

        const { productId, outletId, partnerId, rate, transactionType, quantity, transactionStatus, dueDate, paidOn } = transaction;

        let decimalQuantity = {
            unit: quantity.unit,
            count: new Decimal(quantity.count)
        }
        
        const [inventoryItem, parentTree] = await Promise.all([
            this._inventoryService.getInventoryItemByOutletAndProduct(productId, outletId),
            this._unitService.getParentTree(decimalQuantity.unit),
        ]);

        const existingQuantities = inventoryItem.quantityAvailable;
        if (parentTree.length > 1) {
            decimalQuantity = TransactionServiceHelper.convertToTopLevelUnit(decimalQuantity, parentTree);
        }

        existingQuantities.forEach(existingQuantity => {
            if(existingQuantity.unit === decimalQuantity.unit) {
                const decimalQuantityNumberCount = decimalQuantity.count.toNumber();
                if(transactionType == TransactionType.PURCHASE){
                    existingQuantity.count -= decimalQuantityNumberCount
                }
                else {
                    existingQuantity.count += decimalQuantityNumberCount
                }
            }
        })

        await this._inventoryService.updateAvailableQuantity(inventoryItem.id, existingQuantities);
        await this._transactionRepository.findByIdAndDelete(transactionId);
    }

    async getTransactionsByOrganization(organizationId: string): Promise<TransactionResponseDto[]> {
        const outlets = await this._outletService.getOutletsByOrganization(organizationId);
        const outletIds = outlets.map(outlet => outlet.id)
        if(!outletIds.length){
            return [];
        }
        const transactions = await this._transactionRepository.find({outletId: {$in: outletIds}});
        return transactions.map(transaction => ({
            id: transaction.id,
            transactionType: transaction.transactionType,
            amount: transaction.amount,
            transactionStatus: transaction.transactionStatus,
            dueDate: transaction.dueDate,
            paidOn: transaction.paidOn
        }))
    }

    async toggleTransactionStatus(transactionId: string) {
        const transaction = await this._transactionRepository.findById(transactionId);
        if(!transaction) {
            throw new BadRequestException(`Transaction with ID ${transactionId} does not exist.`);
        }
        if(transaction.transactionStatus === TransactionStatus.PENDING) {
            transaction.transactionStatus = TransactionStatus.COMPLETED;
        }
        else if(transaction.transactionStatus === TransactionStatus.COMPLETED) {
            transaction.transactionStatus = TransactionStatus.PENDING;
        }
        await this._transactionRepository.findByIdAndUpdate(transactionId, {
            transactionStatus: transaction.transactionStatus,
            paidOn: transaction.transactionStatus === TransactionStatus.COMPLETED ? new Date() : undefined,
            dueDate: transaction.transactionStatus === TransactionStatus.PENDING ? new Date() : undefined
        });
    }

    async getTransactionById(transactionId: string): Promise<SingleTransactionResponseDto> {
        const transaction = await this._transactionRepository.findById(transactionId);
        if(!transaction) {
            throw new BadRequestException(`Transaction with ID ${transactionId} does not exist.`);
        }
        return {
            id: transaction.id,
            transactionType: transaction.transactionType,
            amount: transaction.amount,
            transactionStatus: transaction.transactionStatus,
            dueDate: transaction.dueDate,
            paidOn: transaction.paidOn,
            rate: transaction.rate,
            productId: transaction.productId,
            partnerId: transaction.partnerId,
            outletId: transaction.outletId,
            quantity: {
                unit: transaction.quantity.unit,
                count: transaction.quantity.count
            }
        }

    }
}