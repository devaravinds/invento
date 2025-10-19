import { Body, Controller, Post, Request } from "@nestjs/common";
import { ApiHeader, ApiOperation, ApiTags } from "@nestjs/swagger";
import { LoginDto, LoginResponse } from "./authentication.dto";
import { AuthenticationService } from "./authentication.service";
import { OrganizationIdExempted } from "./authentication.decorator";
import { RegisterDto } from "src/user/user.dto";

@Controller('auth')
@ApiTags('Authentication APIs')
export class AuthenticationController {

    constructor(private readonly _authenticationService: AuthenticationService) {}
    
    @Post('login')
    @ApiOperation({ summary: 'Login!' })
    @OrganizationIdExempted()
    async login(@Body() loginDto: LoginDto) {
        const loginResponse: LoginResponse = await this._authenticationService.login(loginDto);
        return {
            statusCode: 200,
            message: 'Login successful',
            data: loginResponse,
        };
    }

    @Post('create-super-admin')
    @ApiOperation({ summary: 'Create Super Admin' })
    @OrganizationIdExempted()
    @ApiHeader({ name: 'secret-key', required: true})
    async createSuperAdmin(@Request() apiRequest, @Body() loginDto: RegisterDto) {
        const secretKey = apiRequest.headers['secret-key'];
        const userId = await this._authenticationService.createSuperAdmin(secretKey, loginDto);
        return {
            statusCode: 201,
            message: 'Super Admin created successfully',
            id: userId,
        };
    }
}