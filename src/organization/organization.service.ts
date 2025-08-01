import { HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { AddOrganizationDto as AddOrganizationDto } from './organization.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Organization, OrganizationDocument } from './organization.entity';
import { BaseService } from 'src/base/base.service';

@Injectable()
export class OrganizationService extends BaseService<OrganizationDocument> {
    constructor(
      @InjectModel(Organization.name)
      private readonly _organizationRepository: Model<OrganizationDocument>
    ) {
      super(_organizationRepository);
    }

    async addOrganization(addOrganizationDto: AddOrganizationDto) {
        const newOrganization = new this._organizationRepository(addOrganizationDto);
        try {
            const createdOrganization = await newOrganization.save();
            return {status: HttpStatus.CREATED, message: 'Organization created successfully', id: createdOrganization._id};
        }
        catch (error) {
            throw new InternalServerErrorException(`Error creating organization: ${error.message}`);
        }
    }

    async updateOrganization(id: string, addOrganizationDto: AddOrganizationDto): Promise<string> {
      try {
        const organizationExists = await this.checkExists(id);
        if (!organizationExists) {
          throw new NotFoundException('Organization not found')
        }
      } catch (error) {
        throw new InternalServerErrorException(`Error checking organization existence: ${error.message}`);
      }
      try {
        const updatedOrganization = await this._organizationRepository.findByIdAndUpdate(id, addOrganizationDto);
        return updatedOrganization._id.toString();
      }
      catch (error) {
        throw new InternalServerErrorException(`Error updating organization: ${error.message}`);
      }
    }

    async getOrganizationById(id: string): Promise<OrganizationDocument> {
        try {
            const organization = await this._organizationRepository.findById(id);
            if (!organization) {
                throw new InternalServerErrorException(`Organization with ID ${id} does not exist.`);
            }
            return organization;
        } catch (error) {
            throw new InternalServerErrorException(`Error retrieving organization by ID: ${error.message}`);
        }
    }
      
}
