import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OrganizationSchema } from './organization.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: 'Organization', schema: OrganizationSchema }
    ])
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService, JwtService],
  exports: [OrganizationService]
})
export class OrganizationModule {}
