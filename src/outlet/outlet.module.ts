import { Module } from '@nestjs/common';
import { OutletController } from './outlet.controller';
import { OutletService } from './outlet.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OutletSchema } from './outlet.entity';
import { OrganizationModule } from 'src/organization/organization.module';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: 'Outlet', schema: OutletSchema }
    ]),
    OrganizationModule
  ],
  controllers: [OutletController],
  providers: [OutletService],
  exports: [OutletService]
})
export class OutletModule {}
