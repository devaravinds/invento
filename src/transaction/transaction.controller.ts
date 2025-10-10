import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/authentication/authentication.guard";
import { TransactionService } from "./transaction.service";
import { AddTransactionDto } from "./transaction.dto";

@Controller('transactions')
@ApiTags('Transaction APIs')
@ApiHeader({ name: 'organization-id', required: true, description: 'Organization ID' })
@UseGuards(AuthGuard)
@ApiBearerAuth('bearer')
export class TransactionController {
    constructor(private readonly _transactionService: TransactionService) {}

    @Post()
    @ApiOperation({ summary: 'Add a new transaction' })
    async addTransaction(@Request() apiRequest, @Body() addTransactionDto: AddTransactionDto) {
        const organizationId = apiRequest.organizationId;
        const transactionId = await this._transactionService.addTransaction(organizationId, addTransactionDto);
        return {
            status: 201,
            message: 'Transaction Added Successfully',
            id: transactionId
        };
    }

    @Get()
    @ApiOperation({ summary: 'Get all transactions by Organization' })
    async getAllTransactionsByOrganization(@Request() apiRequest) {
        const organizationId = apiRequest.organizationId;
        const transactions = await this._transactionService.getTransactionsByOrganization(organizationId);
        return {
            status: 200,
            data: transactions,
            message: 'Transactions fetched successfully'
        }
    }
}