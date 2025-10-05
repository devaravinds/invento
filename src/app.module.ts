import { Module } from '@nestjs/common';
import { POSTGRES_PASSWORD, POSTGRES_PORT, POSTGRES_USERNAME } from './config/system.config';
import { OutletModule } from './outlet/outlet.module';
import { ProductModule } from './product/product.module';
import { InventoryItemModule } from './inventory-item/inventory-item.module';
import { OrganizationModule } from './organization/organization.module';
import { UserModule } from './user/user.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { PartnerModule } from './person/partner.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    AuthenticationModule,
    UserModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: POSTGRES_PORT,
      username: POSTGRES_USERNAME,
      password: POSTGRES_PASSWORD,
      database: 'invento',
      autoLoadEntities: true,
      synchronize: true,
    }),
    OrganizationModule, 
    OutletModule, 
    ProductModule, 
    InventoryItemModule,
    PartnerModule,
    TransactionModule
  ],
})
export class AppModule {}
