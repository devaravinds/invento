import { Module } from '@nestjs/common';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { MongooseModule } from '@nestjs/mongoose';
import { InventorySchema } from './inventory.entity';
import { ProductModule } from 'src/product/product.module';
import { OutletModule } from 'src/outlet/outlet.module';
import { JwtService } from '@nestjs/jwt';
import { UnitModule } from 'src/unit/unit.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Inventory', schema: InventorySchema }
    ]),
    ProductModule,
    OutletModule,
    UnitModule
  ],
  controllers: [InventoryController],
  providers: [
    InventoryService,
    JwtService
  ],
  exports: [InventoryService]
})
export class InventoryModule {}
