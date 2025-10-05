import { Module } from '@nestjs/common';
import { InventoryItemController } from './inventory-item.controller';
import { InventoryItemService } from './inventory-item.service';
import { ProductModule } from 'src/product/product.module';
import { OutletModule } from 'src/outlet/outlet.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryItem } from './inventory-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([InventoryItem]),
    ProductModule,
    OutletModule
  ],
  controllers: [InventoryItemController],
  providers: [InventoryItemService]
})
export class InventoryItemModule {}
