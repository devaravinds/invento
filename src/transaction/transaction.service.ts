import { AddTransactionDto } from "./transaction.dto";
import { Transaction } from "./transaction.entity";
import { BaseService } from "src/base/base.service";
import { BadRequestException, Injectable } from "@nestjs/common";
import { ProductService } from "src/product/product.service";
import { OutletService } from "src/outlet/outlet.service";
import { OrganizationService } from "src/organization/organization.service";
import { TransactionStatus } from "./transaction.enum";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class TransactionService extends BaseService<Transaction> {

    constructor(
        @InjectRepository(Transaction)
        private readonly _transactionRepository: Repository<Transaction>,
        private readonly _productService: ProductService,
        private readonly _outletService: OutletService,
        private readonly _organizationService: OrganizationService
    ) {
        super(_transactionRepository);
    }

    async addTransaction(organizationId: number, addTransactionDto: AddTransactionDto) {
        const { productId, outletId, partnerId, rate, count, transactionType } = addTransactionDto;
        
        const productExists = await this._productService.getById(productId);
        if (!productExists || productExists.organization.id !== organizationId) {
            throw new BadRequestException(`Product with ID ${productId} does not exist.`);
        }

        const outletExists = await this._outletService.getById(outletId);
        if (!outletExists || outletExists.organization.id !== organizationId) {
            throw new BadRequestException(`Outlet with ID ${outletId} does not exist.`);
        }

        const organizationExists = await this._organizationService.checkExists(organizationId);
        if (!organizationExists) {
            throw new BadRequestException(`Organization with ID ${organizationId} does not exist.`);
        }

        // const newTransaction: Transaction = {
        //     productId,
        //     outletId,
        //     partnerId,
        //     rate,
        //     count,
        //     transactionType,
        //     transactionStatus: TransactionStatus.PENDING
        // } 
    }
}