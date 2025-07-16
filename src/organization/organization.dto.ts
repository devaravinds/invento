import { ApiProperty } from "@nestjs/swagger";

export class AddOrganizationDto {
    @ApiProperty({ description: 'Name of the organization', type: String })
    name: string;
    @ApiProperty({ description: 'Phone number of the organization', type: String })
    phone: string;
}

export class OrganizationResponseDto {
    @ApiProperty({ description: 'ID of the organization', type: String })
    id: string;
    @ApiProperty({ description: 'Name of the organization', type: String })
    name: string;
    @ApiProperty({ description: 'Phone number of the organization', type: String })
    phone: string;
}