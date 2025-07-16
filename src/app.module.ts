import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_URL } from './config/system.config';
import { OutletModule } from './outlet/outlet.module';
import { ProductModule } from './product/product.module';
import { InventoryItemModule } from './inventory-item/inventory-item.module';
import { OrganizationModule } from './organization/organization.module';

@Module({
  imports: [
    MongooseModule.forRoot(DATABASE_URL), 
    OrganizationModule, 
    OutletModule, 
    ProductModule, 
    InventoryItemModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
