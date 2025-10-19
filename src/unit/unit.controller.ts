import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UnitService } from './unit.service';
import { AddUnitDto } from './unit.dto';
import { AuthGuard } from 'src/authentication/authentication.guard';

@Controller('units')
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
        const createdUnitId =  await this._unitService.addUnit(organizationId, addUnitDto);
        return { statusCode: 201, message: 'Unit created successfully', id: createdUnitId };
    }

    @Get()
    @ApiOperation({ summary: 'Get all Units for an organization' })
    async getUnits(@Request() apiRequest) {
        const organizationId = apiRequest.organizationId;
        const units = await this._unitService.getUnitsByOrganization(organizationId);
        return { statusCode: HttpStatus.OK, data: units, message: "Units fetched Successfully" }
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a unit by id' })
    async updateUnit(@Request() apiRequest, @Body() updateUnitDto: AddUnitDto, @Param('id') id: string) {
        const organizationId = apiRequest.organizationId;
        await this._unitService.updateById(organizationId, id, updateUnitDto);
        return { statusCode: 200, message: 'Unit updated successfully' };
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a Unit by ID' })
    async deleteUnit(@Param('id') id: string) {
        await this._unitService.deleteById(id);
        return { statusCode: 200, message: 'Unit deleted successfully' };
    }
}
