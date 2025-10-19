import { ApiProperty } from "@nestjs/swagger";
import { TransactionStatus, TransactionType } from "./transaction.enum";
import { QuantityDto } from "src/inventory/inventory.dto";

export class AddTransactionDto {
    @ApiProperty({ description: 'Rate of the transaction', example: 100 })
    rate: number;
    @ApiProperty({ description: 'ID of the product involved in the transaction', example: '60c72b2f9b1e8b001c8e4d3a' })
    productId: string;
    @ApiProperty({ description: 'ID of the partner involved in the transaction', example: '60c72b2f9b1e8b001c8e4d3b' })
    partnerId: string;
    @ApiProperty({ description: 'ID of the outlet involved in the transaction', example: '60c72b2f9b1e8b001c8e4d3c' })
    outletId: string;
    @ApiProperty({ description: 'Quantity of items' })
    quantity: QuantityDto;    
    @ApiProperty({ description: 'Type of the transaction', enum: TransactionType, example: TransactionType.SALE })
    transactionType: TransactionType;
    @ApiProperty({ description: 'Status of the transaction', enum: TransactionStatus, example: TransactionStatus.PENDING })
    transactionStatus: TransactionStatus;
    @ApiProperty({ description: 'Due date for the transaction, if applicable', example: '2024-12-31T23:59:59.999Z', required: false })
    dueDate?: Date;
    @ApiProperty({ description: 'Date when the transaction was paid, if applicable', example: '2024-11-30T23:59:59.999Z', required: false })
    paidOn?: Date;
}

export class TransactionResponseDto {
    @ApiProperty()
    id: string;
    @ApiProperty()
    transactionType: TransactionType;
    @ApiProperty()
    amount: number;
    @ApiProperty()
    transactionStatus: TransactionStatus;
    @ApiProperty()
    dueDate?: Date;    
    @ApiProperty()
    paidOn?: Date;
}

export class SingleTransactionResponseDto extends TransactionResponseDto {
    @ApiProperty()
    rate: number
    @ApiProperty()
    productId: string
    @ApiProperty()
    partnerId: string
    @ApiProperty()
    outletId: string
    @ApiProperty()
    quantity: QuantityDto
}