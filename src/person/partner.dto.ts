import { ApiProperty } from "@nestjs/swagger";

export class AddPartnerDto {
    @ApiProperty()
    name: string;
    @ApiProperty()
    phone: string;
}