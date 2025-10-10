import { Module } from '@nestjs/common';
import { InventoryItemController } from './inventory-item.controller';
import { InventoryItemService } from './inventory-item.service';
import { MongooseModule } from '@nestjs/mongoose';
import { InventoryItemSchema } from './inventory-item.entity';
import { ProductModule } from 'src/product/product.module';
import { OutletModule } from 'src/outlet/outlet.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'InventoryItem', schema: InventoryItemSchema }
    ]),
    ProductModule,
    OutletModule
  ],
  controllers: [InventoryItemController],
  providers: [
    InventoryItemService,
    JwtService
  ],
  exports: [InventoryItemService]
})
export class InventoryItemModule {}
