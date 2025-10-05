import { ApiProperty } from "@nestjs/swagger";
import { InvitationStatus } from "./user.enum";

export class RegisterDto {
    @ApiProperty({ description: 'First name of the user', type: String })
    firstName: string;
    @ApiProperty({ description: 'Last name of the user', type: String })
    lastName: string;
    @ApiProperty({ description: 'Phone number of the user', type: String })
    phone: string;
    @ApiProperty({ description: 'Password for the user', type: String })
    password: string;
    @ApiProperty({ description: 'Email of the user', type: String, required: false })
    email?: string;
}

export class UpdateUserDto {
    @ApiProperty({ description: 'Phone number of the user', type: String, required: false })
    phone?: string;
    @ApiProperty({ description: 'First name of the user', type: String, required: false })
    firstName?: string;
    @ApiProperty({ description: 'Last name of the user', type: String, required: false })
    lastName?: string;
    @ApiProperty({ description: 'Email of the user', type: String, required: false })
    email?: string;
}

export class UserResponseDto {
    id: string;
    phone: string;
    firstName: string;
    lastName: string;
    roles: RoleResponseDto[];
    email?: string;
    isSuperAdmin?: Boolean;
}

class RoleResponseDto {
    organization: string;
    role: string;
    invitationStatus?: InvitationStatus;
}