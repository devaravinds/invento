import { Model } from "mongoose";
import { AddPartnerDto, PartnerResponseDto } from "./partner.dto";
import { Partner, PartnerDocument } from "./partner.entity";
import { BaseService } from "src/base/base.service";
import { BadRequestException, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { OrganizationService } from "src/organization/organization.service";

export class PartnerService extends BaseService<PartnerDocument> {
    constructor(
      @InjectModel(Partner.name)
      private readonly _partnerRepository: Model<PartnerDocument>,
      private readonly _organizationService: OrganizationService
      
    ) {
        super(_partnerRepository);
    }
    
    async addPartner(organizationId: string, addPartnerDto: AddPartnerDto): Promise<string> {
        const parentOrganization = await this._organizationService.getById(organizationId);
        if (!parentOrganization) {
            throw new BadRequestException(`Organization with ID ${organizationId} does not exist.`);
        }
        const partner: Partner = {
          name:addPartnerDto.name,
          description: addPartnerDto.description,
          phone: addPartnerDto.phone,
          organizationId: organizationId,
          address: addPartnerDto.address,
          gstNumber: addPartnerDto.gstNumber
        }
        try {
          const createdPartner = await this._partnerRepository.create(partner);
          return createdPartner._id.toString();
        }
        catch (error) {
            throw new InternalServerErrorException(`Error adding partner: ${error.message}`);
        }
    }
    
    async updatePartner(organizationId: string, id: string, addPartnerDto: AddPartnerDto): Promise<string> {
      try {
        const partnerExists = await this.getById(id);
        if (!partnerExists || partnerExists.organizationId !== organizationId) {
          throw new NotFoundException('Partner not found for the current organization');
        }
      } catch (error) {
        throw new InternalServerErrorException(`Error checking partner existence: ${error.message}`);
      }
      try {
        const partnerToUpdate: Partner = {
          name: addPartnerDto.name,
          description: addPartnerDto.description,
          phone: addPartnerDto.phone,
          organizationId: organizationId,
          address: addPartnerDto.address,
          gstNumber: addPartnerDto.gstNumber
        } 
        const updatedPartner = await this._partnerRepository.findByIdAndUpdate(id, partnerToUpdate);
        return updatedPartner._id.toString();
      }
      catch (error) {
        throw new InternalServerErrorException(`Error updating partner: ${error.message}`);
      }    
    }

    async getPartnersByOrganization(organizationId: string): Promise<PartnerResponseDto[]> {
      try {
        const partners = await this._partnerRepository.find({ organizationId });
        return partners.map(partner => ({
            id: partner._id.toString(),
            name: partner.name,
            description: partner.description,
            phone: partner.phone,
            address: {
              line1: partner.address.line1,
              line2: partner.address.line2,
              city: partner.address.city,
              district: partner.address.district,
              state: partner.address.state,
              pin: partner.address.pin
            },
            gstNumber: partner.gstNumber
        }));
      } catch (error) {
          throw new InternalServerErrorException(`Error retrieving partners. Error: ${error.message}`);
      }
    }

  async getPartnerById(partnerId: string, organizationId: string): Promise<PartnerResponseDto> {
    try {
      const partner = await this._partnerRepository.findById(partnerId);

      if (!partner || partner.organizationId != organizationId) {
        throw new NotFoundException(`Partner with ID ${partnerId} not found in the current organization`);
      }

      const { _id, name, description, phone, address, gstNumber } = partner;

      return {
        id: _id.toString(),
        name,
        description,
        phone,
        address: {
          line1: partner.address.line1,
          line2: partner.address.line2,
          city: partner.address.city,
          district: partner.address.district,
          state: partner.address.state,
          pin: partner.address.pin
        },
        gstNumber
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException(
        `Failed to retrieve partner with ID ${partnerId}. Error: ${error?.message || error}`
      );
    }
  }

}