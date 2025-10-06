import { BadRequestException, Injectable } from '@nestjs/common';
import { AddUnitDto, UnitResponseDto } from './unit.dto';
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

    async getUnitsByOrganization(organizationId: string): Promise<UnitResponseDto[]> {
        const units = await this._unitRepository.find({ organizationId: organizationId }).exec();
        return units.map(unit => ({
            id: unit._id.toString(),
            name: unit.name,
            symbol: unit.symbol,
            conversionFactor: unit.conversionFactor,
            parent: unit.parent,
            organizationId: unit.organizationId
        }));
    }

    async getUnitById(id: string): Promise<UnitResponseDto> {
        const unit = await this._unitRepository.findById(id).exec();
        if (!unit) {
            throw new BadRequestException('Unit not found');
        }
        return {
            id: unit._id.toString(),
            name: unit.name,
            symbol: unit.symbol,
            conversionFactor: unit.conversionFactor,
            parent: unit.parent,
            organizationId: unit.organizationId
        };
    }

    async findUnitsWithSameNameOrSymbol(organizationId: string, name: string, symbol: string): Promise<string[]> {
        const existingUnits = await this._unitRepository.find({
            organizationId: organizationId,
            $or: [{ name: name }, { symbol: symbol }]
        }).exec();
        return existingUnits.map(unit => unit._id.toString());
    }

    async addUnit(organizationId: string, addUnitDto: AddUnitDto): Promise<string> {
        const { name, symbol } = addUnitDto;
        if((await this.findUnitsWithSameNameOrSymbol(organizationId, name, symbol)).length) {
            throw new BadRequestException('A unit with the same name or symbol already exists in this organization.');
        }
        if(addUnitDto.parent) {
            const parentUnit = await this.getUnitById(addUnitDto.parent);
            if(!parentUnit || parentUnit.organizationId !== organizationId) {
                throw new BadRequestException('Parent unit not found in this organization.');
            }
        }
        const newUnit: Unit = {
            name: addUnitDto.name,
            symbol: addUnitDto.symbol,
            conversionFactor: addUnitDto.conversionFactor,
            parent: addUnitDto.parent,
            organizationId: organizationId
        }
        const createdUnit = await this._unitRepository.create(newUnit);
        return createdUnit.id;
    }

    async deleteById(id: string): Promise<void> {
        await this._unitRepository.deleteOne({ _id: id }).exec();
    }

    async updateById(organizationId: string, id: string, addUnitDto: AddUnitDto): Promise<void> {
        const { name, symbol } = addUnitDto;
        const existingUnit = await this.getUnitById(id);
        if(!existingUnit) {
            throw new BadRequestException('Unit not found');
        }
        const existingUnitIds = await this.findUnitsWithSameNameOrSymbol(organizationId, name, symbol)
        if(existingUnitIds.length || existingUnitIds[0] !== id) {
            throw new BadRequestException('A unit with the same name or symbol already exists in this organization.');
        }
        if(addUnitDto.parent) {
            const parentUnit = await this.getUnitById(addUnitDto.parent);
            if(!parentUnit || parentUnit.organizationId !== organizationId) {
                throw new BadRequestException('Parent unit not found in this organization.');
            }
        }
        await this._unitRepository.updateOne({ _id: id }, {
            $set: {
                name: addUnitDto.name,
                symbol: addUnitDto.symbol,
                conversionFactor: addUnitDto.conversionFactor,
                parent: addUnitDto.parent
            }
        });
    }
}
