import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './organization.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Organization])
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService, JwtService],
  exports: [OrganizationService]
})
export class OrganizationModule {}
