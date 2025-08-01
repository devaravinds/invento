import { ApiProperty } from "@nestjs/swagger";
import { UserRoles } from "src/user/user.enum";

export class LoginDto {
    @ApiProperty({ description: 'phone of the user', type: String })
    phone: string;
    @ApiProperty({ description: 'password of the user', type: String })
    password: string;
}

export class LoginResponse {
    token: string;
    user: User;
}

class User {
    id: string;
    phone: string;
    name: string;
    email: string;
    role: Role[];
}

class Role {
    organizationId: string;
    role: UserRoles;
}