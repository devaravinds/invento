import { Body, Controller, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { AddOrganizationDto as AddOrganizationDto } from './organization.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/authentication/authentication.guard';
import { OrganizationIdExempted, Roles } from 'src/authentication/authentication.decorator';
import { UserRoles } from 'src/user/user.enum';

@Controller('organizations')
@ApiTags('Organization APIs')
@ApiBearerAuth('bearer')
@UseGuards(AuthGuard)
export class OrganizationController {
  constructor(private readonly _organizationService: OrganizationService) {}

  @Post()
  @ApiOperation({ summary: 'Add a new organization' })
  @Roles(UserRoles.ADMIN, UserRoles.SUPER_ADMIN)
  @OrganizationIdExempted()
  async addOrganization(@Body() addOrganizationDto: AddOrganizationDto) {
    return await this._organizationService.addOrganization(addOrganizationDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update Organization Details' })
  @Roles(UserRoles.ADMIN, UserRoles.SUPER_ADMIN)
  async updateOrganization(@Body() addOrganizationDto: AddOrganizationDto, @Param('id') id: string) {
    await this._organizationService.updateOrganization(id, addOrganizationDto);
    return {statusCode: HttpStatus.OK, message: 'Organization Updated Successfully', id: id}
  }
}
