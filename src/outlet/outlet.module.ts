import { Module } from '@nestjs/common';
import { OutletController } from './outlet.controller';
import { OutletService } from './outlet.service';
import { OrganizationModule } from 'src/organization/organization.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Outlet } from './outlet.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Outlet]),
    OrganizationModule
  ],
  controllers: [OutletController],
  providers: [OutletService],
  exports: [OutletService]
})
export class OutletModule {}
