import { HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
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

    async updateOrganization(id: string, addOrganizationDto: AddOrganizationDto) {
      try {
        const organizationExists = await this.checkExists(id);
        if (!organizationExists) {
          return {status: HttpStatus.NOT_FOUND, message: 'Organization not found', id: id};
        }
      } catch (error) {
        throw new InternalServerErrorException(`Error checking organization existence: ${error.message}`);
      }
      try {
        const updatedOrganization = await this._organizationRepository.findByIdAndUpdate(id, addOrganizationDto);
        return {status: HttpStatus.OK, message: 'Organization updated successfully', id: updatedOrganization._id};
      }
      catch (error) {
        throw new InternalServerErrorException(`Error updating organization: ${error.message}`);
      }
    }
}
