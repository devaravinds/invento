import { HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { AddOrganizationDto as AddOrganizationDto } from './organization.dto';
import { Organization } from './organization.entity';
import { BaseService } from 'src/base/base.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrganizationService extends BaseService<Organization> {
    constructor(
      @InjectRepository(Organization)
      private readonly _organizationRepository: Repository<Organization>
    ) {
      super(_organizationRepository);
    }

    async addOrganization(addOrganizationDto: AddOrganizationDto) {
        try {
            const createdOrganization = await this._organizationRepository.save(addOrganizationDto);
            return {status: HttpStatus.CREATED, message: 'Organization created successfully', id: createdOrganization.id.toString()};
        }
        catch (error) {
            throw new InternalServerErrorException(`Error creating organization: ${error.message}`);
        }
    }

    async updateOrganization(id: number, addOrganizationDto: AddOrganizationDto): Promise<string> {
      try {
        const organizationExists = await this.checkExists(id);
        if (!organizationExists) {
          throw new NotFoundException('Organization not found')
        }
      } catch (error) {
        throw new InternalServerErrorException(`Error checking organization existence: ${error.message}`);
      }
      try {
        const updatedOrganization = await this._organizationRepository.update(id, addOrganizationDto);
        return updatedOrganization.raw.id.toString();
      }
      catch (error) {
        throw new InternalServerErrorException(`Error updating organization: ${error.message}`);
      }
    }

    async getOrganizationById(id: number): Promise<Organization> {
        try {
            const organization = await this._organizationRepository.findOne({where: { id }});
            if (!organization) {
                throw new InternalServerErrorException(`Organization with ID ${id} does not exist.`);
            }
            return organization;
        } catch (error) {
            throw new InternalServerErrorException(`Error retrieving organization by ID: ${error.message}`);
        }
    }
      
}
