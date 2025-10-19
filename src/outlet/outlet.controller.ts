import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OutletService } from './outlet.service';
import { AddOutletDto, OutletByPhoneResponseDto, OutletResponseDto } from './outlet.dto';
import { AuthGuard } from 'src/authentication/authentication.guard';
import { OrganizationIdExempted } from 'src/authentication/authentication.decorator';

@Controller('outlets')
@ApiHeader({
  name: 'organization-id',
  required: true,
  description: 'Organization ID',
})
@UseGuards(AuthGuard)
@ApiBearerAuth('bearer')
@ApiTags('Outlet APIs')
export class OutletController {
    constructor(private readonly _outletService: OutletService) {}
    
    @Post()
    @ApiOperation({ summary: 'Add a new outlet' })
    async addOutlet(@Request() apiRequest, @Body() addOutletDto: AddOutletDto) {
        const organizationId = apiRequest.organizationId;
        return await this._outletService.addOutlet(organizationId, addOutletDto);
    }

    @Get(":phone")
    @ApiOperation({ summary: 'Get outlet by phone number' })
    @OrganizationIdExempted()
    async getOutletByPhone(@Param('phone') phone: string) {
        const outlet: OutletByPhoneResponseDto = await this._outletService.getOutletByPhone(phone);
        return {
            statusCode: 200,
            message: 'Outlet retrieved successfully',
            data: outlet
        };
    }

    @Get()
    @ApiOperation({ summary: 'Get all outlets by organization' })
    async getOutletsByOrganization(@Request() apiRequest) {
        const organizationId = apiRequest.organizationId;
        const outlets: OutletResponseDto[] = await this._outletService.getOutletsByOrganization(organizationId);
        return {
            statusCode: 200,
            message: 'Outlets retrieved successfully',
            data: outlets
        };
    }
}
