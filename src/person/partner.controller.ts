import { Body, Controller, HttpStatus, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/authentication/authentication.guard';
import { Roles } from 'src/authentication/authentication.decorator';
import { UserRoles } from 'src/user/user.enum';
import { PartnerService } from './partner.service';
import { AddPartnerDto } from './partner.dto';

@Controller('partner')
@ApiTags('Partner APIs')
@ApiHeader({ name: 'organization-id', required: true, description: 'Organization ID' })
@ApiBearerAuth('bearer')
@UseGuards(AuthGuard)
export class PartnerController {
  constructor(private readonly _partnerService: PartnerService) {}

  @Post()
  @ApiOperation({ summary: 'Add a new partner' })
  @Roles(UserRoles.ADMIN)
  async addPartner(@Request() apiRequest, @Body() addPartnernDto: AddPartnerDto) {
    const organizationId = apiRequest.organizationId;
    const partnerId = await this._partnerService.addPartner(organizationId, addPartnernDto);
    return {
      status: HttpStatus.CREATED, 
      message: 'Partner Added Successfully', 
      id: partnerId
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update Partner Details' })
  async updatePartner(@Request() apiRequest, @Body() addPartnerDto: AddPartnerDto, @Param('id') id: string) {
    const organizationId = apiRequest.organizationId;
    await this._partnerService.updatePartner(organizationId, id, addPartnerDto);
    return {status: HttpStatus.OK, message: 'Partner Updated Successfully', id: id}
  }
}
