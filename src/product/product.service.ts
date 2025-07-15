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
    async addProduct(addProductDto: AddProductDto) {
        const newProduct = new this._productRepository(addProductDto);
        try {
            const createdProduct = await newProduct.save();
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
                price: product.price,
                description: product.description
            };
        }
        catch(error) {
            throw new InternalServerErrorException(`Error retrieving product with ID ${productId}. Error: ${error.message}`);
        }
    }

    async getProductsByIds(productIds: String[]): Promise<ProductResponseDto[]> {
        try {
            const products = await this._productRepository.find({ _id: { $in: productIds } });
            return products.map(product => ({
                id: product._id.toString(),
                name: product.name,
                price: product.price,
                description: product.description
            }));
        } catch (error) {
            throw new InternalServerErrorException(`Error retrieving products. Error: ${error.message}`);
        }
    }
}
