import { HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { AddProductDto, ProductResponseDto } from './product.dto';
import { Product, ProductDocument } from './product.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from 'src/base/base.service';

@Injectable()
export class ProductService extends BaseService<ProductDocument> {
    constructor(
      @InjectModel(Product.name)
      private readonly _productRepository: Model<ProductDocument>
    ) {
        super(_productRepository);
    }
    async addProduct(organizationId: string, addProductDto: AddProductDto) {
        const newProduct: Product = {
            name: addProductDto.name,
            description: addProductDto.description,
            organizationId
        };
        try {
            const createdProduct = await this._productRepository.create(newProduct);
            return {status: HttpStatus.CREATED, message: 'Product created successfully', id: createdProduct._id};
        }
        catch (error) {
            throw new InternalServerErrorException(`Error creating product: ${error.message}`);
        }
    }

    async getProductById(productId: String): Promise<ProductResponseDto> {
        try {
            const product = await this._productRepository.findById(productId);
            if (!product) {
                throw new InternalServerErrorException(`Product with ID ${productId} does not exist.`);
            }
            return {
                id: product._id.toString(),
                name: product.name,
                description: product.description
            };
        }
        catch(error) {
            throw new InternalServerErrorException(`Error retrieving product with ID ${productId}. Error: ${error.message}`);
        }
    }

    async getProductsByIds(productIds: string[]): Promise<ProductResponseDto[]> {
        try {
            const products = await this._productRepository.find({ _id: { $in: productIds } });
            return products.map(product => ({
                id: product._id.toString(),
                name: product.name,
                description: product.description
            }));
        } catch (error) {
            throw new InternalServerErrorException(`Error retrieving products. Error: ${error.message}`);
        }
    }

    async getProductsByOrganization(organizationId: string): Promise<ProductResponseDto[]> {
        try {
            const products = await this._productRepository.find({ organizationId });
            return products.map(product => ({
                id: product._id.toString(),
                name: product.name,
                description: product.description
            }));
        } catch (error) {
            throw new InternalServerErrorException(`Error retrieving products. Error: ${error.message}`);
        }
    }
}
