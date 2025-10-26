import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtService } from "@nestjs/jwt";
import { TransactionSchema } from "./transaction.entity";
import { TransactionService } from "./transaction.service";
import { TransactionController } from "./transaction.controller";
import { ProductModule } from "src/product/product.module";
import { OutletModule } from "src/outlet/outlet.module";
import { OrganizationModule } from "src/organization/organization.module";
import { InventoryModule } from "src/inventory/inventory.module";
import { UnitModule } from "src/unit/unit.module";
import { PartnerModule } from "src/partner/partner.module";
import { PdfService } from "src/pdf/pdf.service";

@Module({
    imports: [
      MongooseModule.forFeature([
        { name: 'Transaction', schema: TransactionSchema }
      ]),
      ProductModule,
      OutletModule,
      OrganizationModule,
      InventoryModule,
      UnitModule,
      PartnerModule
    ],
    controllers: [TransactionController],
    providers: [TransactionService, JwtService, PdfService],
    exports: []
})

export class TransactionModule {}