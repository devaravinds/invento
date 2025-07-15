import { Body, Controller, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { AddProductDto } from './product.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('product')
export class ProductController {
    constructor(private readonly _productService: ProductService) {}
    
    @Post()
    @ApiOperation({ summary: 'Add a new Product' })
    async addProduct(@Body() addProductDto: AddProductDto) {
        return await this._productService.addProduct(addProductDto);
    }
}
