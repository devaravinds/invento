import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_URL } from './config/system.config';
import { OutletModule } from './outlet/outlet.module';
import { ProductModule } from './product/product.module';
import { InventoryItemModule } from './inventory-item/inventory-item.module';
import { OrganizationModule } from './organization/organization.module';
import { UserModule } from './user/user.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { PartnerModule } from './person/partner.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    AuthenticationModule,
    UserModule,
    MongooseModule.forRoot(DATABASE_URL), 
    OrganizationModule, 
    OutletModule, 
    ProductModule, 
    InventoryItemModule,
    PartnerModule
  ],
})
export class AppModule {}
