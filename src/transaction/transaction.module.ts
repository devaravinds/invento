import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtService } from "@nestjs/jwt";
import { TransactionSchema } from "./transaction.entity";
import { TransactionService } from "./transaction.service";
import { TransactionController } from "./transaction.controller";

@Module({
    imports: [
      MongooseModule.forFeature([
        { name: 'Transaction', schema: TransactionSchema }
      ])
    ],
    controllers: [TransactionController],
    providers: [TransactionService, JwtService],
    exports: []
})

export class TransactionModule {}