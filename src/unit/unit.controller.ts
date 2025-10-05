import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UnitService } from './unit.service';
import { AddUnitDto } from './unit.dto';
import { AuthGuard } from 'src/authentication/authentication.guard';

@Controller('unit')
@ApiTags('Unit APIs')
@ApiHeader({ name: 'organization-id', required: true, description: 'Organization ID' })
@UseGuards(AuthGuard)
@ApiBearerAuth('bearer')
export class UnitController {
    constructor(private readonly _unitService: UnitService) {}

    @Post()
    @ApiOperation({ summary: 'Add a new Unit' })
    async addUnit(@Request() apiRequest, @Body() addUnitDto: AddUnitDto) {
        const organizationId = apiRequest.organizationId;
        return await this._unitService.addUnit(organizationId, addUnitDto);
    }
}
