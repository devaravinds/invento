import { Model } from "mongoose";
import { AddPartnerDto } from "./partner.dto";
import { Partner, PartnerDocument } from "./partner.entity";
import { BaseService } from "src/base/base.service";
import { InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

export class PartnerService extends BaseService<PartnerDocument> {
    constructor(
      @InjectModel(Partner.name)
      private readonly _partnerRepository: Model<PartnerDocument>
    ) {
        super(_partnerRepository);
    }
    
    async addPartner(organizationId: string, addPartnerDto: AddPartnerDto): Promise<string> {
        const partner = new Partner();
        partner.name = addPartnerDto.name;
        partner.phone = addPartnerDto.phone;
        partner.organizationId = organizationId;
        try {
          const createdPartner =  await this._partnerRepository.create(partner);
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
          throw new NotFoundException('Partner not found for the curret organization');
        }
      } catch (error) {
        throw new InternalServerErrorException(`Error checking partner existence: ${error.message}`);
      }
      try {
        const partnerToUpdate: Partner = {
          name: addPartnerDto.name,
          phone: addPartnerDto.phone,
          organizationId: organizationId
        } 
        const updatedPartner = await this._partnerRepository.findByIdAndUpdate(id, partnerToUpdate);
        return updatedPartner._id.toString();
      }
      catch (error) {
        throw new InternalServerErrorException(`Error updating partner: ${error.message}`);
      }    
    }
}