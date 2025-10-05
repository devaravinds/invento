import { AddPartnerDto } from "./partner.dto";
import { Partner } from "./partner.entity";
import { BaseService } from "src/base/base.service";
import { InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

export class PartnerService extends BaseService<Partner> {
    constructor(
      @InjectRepository(Partner)
      private readonly _partnerRepository: Repository<Partner>
    ) {
        super(_partnerRepository);
    }
    
    async addPartner(organizationId: number, addPartnerDto: AddPartnerDto): Promise<number> {
        const partner = new Partner();
        partner.name = addPartnerDto.name;
        partner.phone = addPartnerDto.phone;
        partner.organization.id = organizationId;
        try {
          const createdPartner =  await this._partnerRepository.create(partner);
          return createdPartner.id;
        }
        catch (error) {
            throw new InternalServerErrorException(`Error adding partner: ${error.message}`);
        }
    }
    
    async updatePartner(organizationId: number, id: string, addPartnerDto: AddPartnerDto): Promise<string> {
      try {
        const partnerExists = await this.getById(id);
        if (!partnerExists || partnerExists.organization.id !== organizationId) {
          throw new NotFoundException('Partner not found for the curret organization');
        }
      } catch (error) {
        throw new InternalServerErrorException(`Error checking partner existence: ${error.message}`);
      }
      try {
        const updatedPartner = await this._partnerRepository.update(id, {
          name: addPartnerDto.name,
          phone: addPartnerDto.phone,
          organization: { id: organizationId }
        });
        return updatedPartner.raw.id;
      }
      catch (error) {
        throw new InternalServerErrorException(`Error updating partner: ${error.message}`);
      }    
    }
}