import { Body, Controller, Delete, Get, Param, Patch, Post, Request, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/authentication/authentication.guard";
import { TransactionService } from "./transaction.service";
import { AddTransactionDto } from "./transaction.dto";
import { Response } from "express";

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
            statusCode: 201,
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
            statusCode: 200,
            data: transactions,
            message: 'Transactions fetched successfully'
        }
    }

    @Patch(':id/toggle-status')
    @ApiOperation({ summary: 'Toggle transaction status' })
    async toggleTransactionStatus(@Param('id') transactionId: string) {
        await this._transactionService.toggleTransactionStatus(transactionId);
        return {
            statusCode: 200,
            message: 'Transaction status updated successfully'
        }
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get transaction by ID' })
    async getTransactionById(@Param('id') transactionId: string) {
        const transaction = await this._transactionService.getTransactionById(transactionId);
        return {
            statusCode: 200,
            data: transaction,
            message: 'Transaction fetched successfully'
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete transaction by ID' })
    async deleteTransactionById(@Param('id') transactionId: string) {
        await this._transactionService.deleteTransactionById(transactionId);
        return {
            statusCode: 200,
            message: 'Transaction deleted successfully'
        }
    }

    @Get(':id/pdf')
    @ApiOperation({ summary: 'Generate PDF for transaction by ID' })
    async generateTransactionPdf(@Request() apiRequest, @Param('id') transactionId: string, @Res() res: Response) {
        const organizationId = apiRequest.organizationId;
        const pdfBuffer = await this._transactionService.generateTransactionPdf(transactionId, organizationId);
        res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="transaction-${transactionId}.pdf"`,
        'Content-Length': pdfBuffer.length,
        });

        res.end(pdfBuffer);
    }
}