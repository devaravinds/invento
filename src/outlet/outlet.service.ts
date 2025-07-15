import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { AddOutletDto } from './outlet.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Outlet, OutletDocument } from './outlet.entity';
import { Model } from 'mongoose';
import { OrganizationService } from 'src/organization/organization.service';
import { BaseService } from 'src/base/base.service';

@Injectable()
export class OutletService extends BaseService<OutletDocument> {
    constructor(
        @InjectModel(Outlet.name)
        private readonly _outletRepository: Model<OutletDocument>,
        private readonly _organizationService: OrganizationService ,
    ) {
        super(_outletRepository);
    }

    async addOutlet(addOutletDto: AddOutletDto) {
        const {organizationId} = addOutletDto;
        const organizationExists = await this._organizationService.checkExists(organizationId);
        if (!organizationExists) {
            throw new BadRequestException(`Organization with ID ${organizationId} does not exist.`);
        }
        const newOutlet = new this._outletRepository(addOutletDto);
        try {
            const createdOutlet = await newOutlet.save();
            return { status: 201, message: 'Outlet created successfully', id: createdOutlet._id };
        } catch (error) {
            throw new InternalServerErrorException(`Error creating outlet: ${error.message}`);
        }
    }
}
