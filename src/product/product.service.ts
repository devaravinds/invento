import { HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { AddProductDto, ProductResponseDto } from './product.dto';
import { Product } from './product.entity';
import { BaseService } from 'src/base/base.service';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductService extends BaseService<Product> {
    constructor(
      @InjectRepository(Product)
      private readonly _productRepository: Repository<Product>
    ) {
        super(_productRepository);
    }
    async addProduct(organizationId: number, addProductDto: AddProductDto) {
        try {
            const createdProduct = await this._productRepository.save({
                name: addProductDto.name,
                description: addProductDto.description,
                organization: { id: organizationId }
            });
            return {status: HttpStatus.CREATED, message: 'Product created successfully', id: createdProduct.id};
        }
        catch (error) {
            throw new InternalServerErrorException(`Error creating product: ${error.message}`);
        }
    }

    async getProductById(productId: number): Promise<ProductResponseDto> {
        try {
            const product = await this._productRepository.findOne({where: { id: productId }});
            if (!product) {
                throw new InternalServerErrorException(`Product with ID ${productId} does not exist.`);
            }
            return {
                id: product.id,
                name: product.name,
                description: product.description
            };
        }
        catch(error) {
            throw new InternalServerErrorException(`Error retrieving product with ID ${productId}. Error: ${error.message}`);
        }
    }

    async getProductsByIds(productIds: String[]): Promise<ProductResponseDto[]> {
        try {
            const products = await this._productRepository.find({
                where: {
                    id: In(productIds),
                },
            });            
            return products.map(product => ({
                id: product.id,
                name: product.name,
                description: product.description
            }));
        } catch (error) {
            throw new InternalServerErrorException(`Error retrieving products. Error: ${error.message}`);
        }
    }
}
