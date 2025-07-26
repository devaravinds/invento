import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { LoginDto, LoginResponse } from "./authentication.dto";
import { AuthenticationService } from "./authentication.service";

@Controller('auth')
@ApiTags('Authentication APIs')
export class AuthenticationController {

    constructor(private readonly _authenticationService: AuthenticationService) {}
    
    @Post('login')
    @ApiOperation({ summary: 'Login!' })
    async login(@Body() loginDto: LoginDto) {
        const loginResponse: LoginResponse = await this._authenticationService.login(loginDto);
        return {
            status: 200,
            message: 'Login successful',
            data: loginResponse,
        };
    }
}