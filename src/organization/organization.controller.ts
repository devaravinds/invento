import { Body, Controller, Param, Post, Put, Req } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { AddOrganizationDto as AddOrganizationDto } from './organization.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('organization')
@ApiTags('Organization APIs')
export class OrganizationController {
  constructor(private readonly _organizationService: OrganizationService) {}

  @Post()
  @ApiOperation({ summary: 'Add a new organization' })
  async addOrganization(@Body() addOrganizationDto: AddOrganizationDto) {
    return await this._organizationService.addOrganization(addOrganizationDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update Organization Details' })
  async updateOrganization(@Body() addOrganizationDto: AddOrganizationDto, @Param('id') id: string) {
    return await this._organizationService.updateOrganization(id, addOrganizationDto);
  }
}
