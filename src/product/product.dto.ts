import { ApiProperty } from "@nestjs/swagger";

export class AddProductDto {
    @ApiProperty()
    name: string;
    @ApiProperty()
    description: string;
}

export class ProductResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;
}