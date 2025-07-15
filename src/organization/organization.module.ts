import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OrganizationSchema } from './organization.entity';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: 'Organization', schema: OrganizationSchema }
    ])
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService],
  exports: [OrganizationService]
})
export class OrganizationModule {}
