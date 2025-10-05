import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { AddOutletDto, OutletResponseDto } from './outlet.dto';
import { Outlet } from './outlet.entity';
import { OrganizationService } from 'src/organization/organization.service';
import { BaseService } from 'src/base/base.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OutletService extends BaseService<Outlet> {
    constructor(
        @InjectRepository(Outlet)
        private readonly _outletRepository: Repository<Outlet>,
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
        try {
            const createdOutlet = await this._outletRepository.save(addOutletDto);
            return { status: 201, message: 'Outlet created successfully', id: createdOutlet.id };
        } catch (error) {
            throw new InternalServerErrorException(`Error creating outlet: ${error.message}`);
        }
    }

    async getOutletByPhone(phone: string): Promise<OutletResponseDto> {
        try {
            const outlet = await this._outletRepository.findOne({where: { phone }});
            if (!outlet) {
                throw new BadRequestException(`Outlet with phone ${phone} does not exist.`);
            }
            const organization = await this._organizationService.getOrganizationById(outlet.organization.id);
            const outletResponse: OutletResponseDto = {
                id: outlet.id,
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
