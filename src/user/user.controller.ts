import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiBody, ApiOperation } from "@nestjs/swagger";
import { AuthGuard } from "src/authentication/authentication.guard";
import { UserService } from "./user.service";
import { RegisterDto } from "./user.dto";

@Controller('user')
export class UserController {
    constructor(private readonly _userService: UserService) {}
    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    async register(@Body() registerDto: RegisterDto) {
        const userId = await this._userService.register(registerDto);
        return {
            status: 201,
            message: 'User registered successfully',
            id: userId,
        };
    }
}