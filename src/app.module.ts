import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_URL } from './config/system.config';
import { OutletModule } from './outlet/outlet.module';
import { ProductModule } from './product/product.module';
import { InventoryModule } from './inventory/inventory.module';
import { OrganizationModule } from './organization/organization.module';
import { UserModule } from './user/user.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { PartnerModule } from './partner/partner.module';
import { TransactionModule } from './transaction/transaction.module';
import { UnitModule } from './unit/unit.module';

@Module({
  imports: [
    AuthenticationModule,
    UserModule,
    MongooseModule.forRoot(DATABASE_URL), 
    OrganizationModule, 
    OutletModule, 
    ProductModule, 
    InventoryModule,
    TransactionModule,
    PartnerModule,
    UnitModule
  ],
})
export class AppModule {}
