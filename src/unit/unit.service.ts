import { Injectable } from '@nestjs/common';
import { AddUnitDto } from './unit.dto';
import { BaseService } from 'src/base/base.service';
import { Unit, UnitDocument } from './unit.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UnitService extends BaseService<UnitDocument> {
    constructor(
        @InjectModel(Unit.name)
        private readonly _unitRepository: Model<UnitDocument>
    ) {
        super(_unitRepository);
    }

    async addUnit(organizationId: string, addUnitDto: AddUnitDto) {
        
    }
}
