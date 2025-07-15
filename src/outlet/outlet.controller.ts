import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OutletService } from './outlet.service';
import { AddOutletDto } from './outlet.dto';

@Controller('outlet')
@ApiTags('Outlet APIs')
export class OutletController {
    constructor(private readonly _outletService: OutletService) {}
    
    @Post()
    @ApiOperation({ summary: 'Add a new outlet' })
    async addOutlet(@Body() addOutletDto: AddOutletDto) {
        return await this._outletService.addOutlet(addOutletDto);
    }
}
