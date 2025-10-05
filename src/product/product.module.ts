import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Product]),
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    JwtService
  ],
  exports: [ProductService]
})
export class ProductModule {}
