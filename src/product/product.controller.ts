import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { AddProductDto } from './product.dto';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/authentication/authentication.guard';

@Controller('product')
@ApiTags('Product APIs')
@ApiHeader({ name: 'organization-id', required: true, description: 'Organization ID' })
@UseGuards(AuthGuard)
@ApiBearerAuth('bearer')
export class ProductController {
    constructor(private readonly _productService: ProductService) {}
    
    @Post()
    @ApiOperation({ summary: 'Add a new Product' })
    async addProduct(@Request() apiRequest, @Body() addProductDto: AddProductDto) {
        const organizationId = apiRequest.organizationId;
        return await this._productService.addProduct(organizationId, addProductDto);
    }
}
