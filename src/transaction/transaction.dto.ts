import { ApiProperty } from "@nestjs/swagger";
import { TransactionType } from "./transaction.enum";
import { QuantityDto } from "src/inventory-item/inventory-item.dto";

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
}