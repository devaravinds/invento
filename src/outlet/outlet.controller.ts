import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OutletService } from './outlet.service';
import { AddOutletDto, OutletResponseDto } from './outlet.dto';

@Controller('outlets')
@ApiTags('Outlet APIs')
export class OutletController {
    constructor(private readonly _outletService: OutletService) {}
    
    @Post()
    @ApiOperation({ summary: 'Add a new outlet' })
    async addOutlet(@Body() addOutletDto: AddOutletDto) {
        return await this._outletService.addOutlet(addOutletDto);
    }

    @Get(":phone")
    async getOutletByPhone(@Param('phone') phone: string) {
        const outlet: OutletResponseDto = await this._outletService.getOutletByPhone(phone);
        return {
            status: 200,
            message: 'Outlet retrieved successfully',
            data: outlet
        };
    }
}
