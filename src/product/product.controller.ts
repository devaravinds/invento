import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { AddProductDto } from './product.dto';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/authentication/authentication.guard';

@Controller('products')
@ApiTags('Product APIs')
@ApiHeader({
  name: 'organization-id',
  required: true,
  description: 'Organization ID',
})
@UseGuards(AuthGuard)
@ApiBearerAuth('bearer')
export class ProductController {
  constructor(private readonly _productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Add a new Product' })
  async addProduct(
    @Request() apiRequest,
    @Body() addProductDto: AddProductDto,
  ) {
    const organizationId = apiRequest.organizationId;
    return await this._productService.addProduct(organizationId, addProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Products by Organization' })
  async getProductsByOrganization(@Request() apiRequest) {
    const organizationId = apiRequest.organizationId;
    const products = await this._productService.getProductsByOrganization(organizationId);
    return {
      status: HttpStatus.OK,
      message: 'Products retrieved successfully',
      data: products,
    };
  }
}
