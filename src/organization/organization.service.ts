import { HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { AddOrganizationDto as AddOrganizationDto, OrganizationResponseDto } from './organization.dto';
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
            return {statusCode: HttpStatus.CREATED, message: 'Organization created successfully', id: createdOrganization._id};
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

    async getOrganizationById(id: string): Promise<OrganizationResponseDto> {
      try {
          const organization = await this._organizationRepository.findById(id);
          if (!organization) {
              throw new InternalServerErrorException(`Organization with ID ${id} does not exist.`);
          }
          return {
              id: organization._id.toString(),
              name: organization.name,
              phone: organization.phone
          }
      } catch (error) {
          throw new InternalServerErrorException(`Error retrieving organization by ID: ${error.message}`);
      }
    }

    async getOrganizationByIds(ids: string[]): Promise<OrganizationResponseDto[]> {
      try {
          const organizations = await this._organizationRepository.find({ _id: { $in: ids } });
          return organizations.map(org => ({
              id: org._id.toString(),
              name: org.name,
              phone: org.phone,
          }));
      } catch (error) {
          throw new InternalServerErrorException(`Error retrieving organizations by IDs: ${error.message}`);
      }
    }

    async getAllOrganizations(): Promise<OrganizationResponseDto[]> {
      try {
          const organizations = await this._organizationRepository.find();
          return organizations.map(org => ({
              id: org._id.toString(),
              name: org.name,
              phone: org.phone,
          }));
      } catch (error) {
          throw new InternalServerErrorException(`Error retrieving all organizations: ${error.message}`);
      }
    }
}
