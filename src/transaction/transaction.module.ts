import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TransactionService } from "./transaction.service";
import { TransactionController } from "./transaction.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Transaction } from "./transaction.entity";
import { ProductService } from "src/product/product.service";
import { OutletService } from "src/outlet/outlet.service";
import { OrganizationService } from "src/organization/organization.service";
import { ProductModule } from "src/product/product.module";
import { OutletModule } from "src/outlet/outlet.module";
import { OrganizationModule } from "src/organization/organization.module";

@Module({
    imports: [
      TypeOrmModule.forFeature([Transaction]) ,
      ProductModule,
      OutletModule,
      OrganizationModule
    ],
    controllers: [TransactionController],
    providers: [
      TransactionService, 
      JwtService, 
      // ProductService, 
      // OutletService,
      // OrganizationService
    ],
    exports: []
})

export class TransactionModule {}