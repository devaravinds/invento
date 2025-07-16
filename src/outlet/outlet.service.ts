import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { AddOutletDto, OutletResponseDto } from './outlet.dto';
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

    async getOutletByPhone(phone: string): Promise<OutletResponseDto> {
        try {
            const outlet = await this._outletRepository.findOne({ phone: phone });
            if (!outlet) {
                throw new BadRequestException(`Outlet with phone ${phone} does not exist.`);
            }
            const organization = await this._organizationService.getOrganizationById(outlet.organizationId);
            const outletResponse: OutletResponseDto = {
                id: outlet._id.toString(),
                organizationName: organization.name,
                name: outlet.name,
                address: outlet.address,
                phone: outlet.phone
            }
            return outletResponse;
        } catch (error) {
            throw new InternalServerErrorException(`Error retrieving outlet by phone: ${error.message}`);
        }
    }
        
}
