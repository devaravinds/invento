import { Module } from '@nestjs/common';
import { UnitController } from './unit.controller';
import { UnitService } from './unit.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UnitSchema } from './unit.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: 'Unit', schema: UnitSchema }
    ])
  ],
  controllers: [UnitController],
  providers: [
    UnitService,
    JwtService
  ],
  exports: [UnitService]
})
export class UnitModule {}
