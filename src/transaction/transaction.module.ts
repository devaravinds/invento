import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtService } from "@nestjs/jwt";
import { TransactionSchema } from "./transaction.entity";
import { TransactionService } from "./transaction.service";
import { TransactionController } from "./transaction.controller";
import { ProductModule } from "src/product/product.module";
import { OutletModule } from "src/outlet/outlet.module";
import { OrganizationModule } from "src/organization/organization.module";
import { InventoryItemModule } from "src/inventory-item/inventory-item.module";
import { UnitModule } from "src/unit/unit.module";

@Module({
    imports: [
      MongooseModule.forFeature([
        { name: 'Transaction', schema: TransactionSchema }
      ]),
      ProductModule,
      OutletModule,
      OrganizationModule,
      InventoryItemModule,
      UnitModule
    ],
    controllers: [TransactionController],
    providers: [TransactionService, JwtService],
    exports: []
})

export class TransactionModule {}