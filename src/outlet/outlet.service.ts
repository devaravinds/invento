import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { AddOutletDto, OutletByPhoneResponseDto, OutletResponseDto } from './outlet.dto';
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

    async addOutlet(organizationId: string, addOutletDto: AddOutletDto) {
        const parentOrganization = await this._organizationService.getById(organizationId);
        if (!parentOrganization) {
            throw new BadRequestException(`Organization with ID ${organizationId} does not exist.`);
        }
        const newOutlet: Outlet = {
            name: addOutletDto.name,
            phone: addOutletDto.phone || parentOrganization.phone,
            address: addOutletDto.address,
            description: addOutletDto.description,
            organizationId: organizationId
        }
        try {
            const createdOutlet = await this._outletRepository.create(newOutlet);
            return { status: 201, message: 'Outlet created successfully', id: createdOutlet._id };
        } catch (error) {
            throw new InternalServerErrorException(`Error creating outlet: ${error.message}`);
        }
    }

    async getOutletByPhone(phone: string): Promise<OutletByPhoneResponseDto> {
        try {
            const outlet = await this._outletRepository.findOne({ phone: phone });
            if (!outlet) {
                throw new BadRequestException(`Outlet with phone ${phone} does not exist.`);
            }
            const organization = await this._organizationService.getOrganizationById(outlet.organizationId);
            const outletResponse: OutletByPhoneResponseDto = {
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

    async getOutletsByOrganization(organizationId: string): Promise<OutletResponseDto[]> {
        try {
            const outlets = await this._outletRepository.find({ organizationId });
            return outlets.map(outlet => ({
                id: outlet._id.toString(),
                name: outlet.name,
                address: outlet.address,
                phone: outlet.phone,
                description: outlet.description
            }));
        } catch (error) {
            throw new InternalServerErrorException(`Error retrieving outlets. Error: ${error.message}`);
        }
    }
        
}
