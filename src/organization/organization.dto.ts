import { ApiProperty } from "@nestjs/swagger";
import { AddressDto, BankDetailsDto } from "src/common/common.dto";

export class AddOrganizationDto {
    @ApiProperty({ description: 'Name of the organization', type: String })
    name: string;
    @ApiProperty({ description: 'Phone number of the organization', type: String })
    phone: string;
    @ApiProperty({ description: 'GST number of the organization', type: String })
    gstNumber: string;
    @ApiProperty({ description: 'Address of the organization', type: String })
    address: AddressDto;
    
}

export class OrganizationResponseDto {
    @ApiProperty({ description: 'ID of the organization', type: String })
    id: string;
    @ApiProperty({ description: 'Name of the organization', type: String })
    name: string;
    @ApiProperty({ description: 'Phone number of the organization', type: String })
    phone: string;
    @ApiProperty({ description: 'GST number of the organization', type: String })
    gstNumber: string;
    @ApiProperty({ description: 'Address of the organization', type: String })
    address: AddressDto;
    @ApiProperty({ description: 'Bank details of the organization', type: () => BankDetailsDto })
    bankDetails: BankDetailsDto;
}