import { Body, Controller, HttpStatus, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiQuery } from "@nestjs/swagger";
import { AuthGuard } from "src/authentication/authentication.guard";
import { UserService } from "./user.service";
import { RegisterDto, UpdateUserDto } from "./user.dto";
import { Roles } from "src/authentication/authentication.decorator";
import { UserRoles } from "./user.enum";

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
    constructor(private readonly _userService: UserService) { }

    @Post('register')
    @Roles(UserRoles.SUPER_ADMIN)
    @ApiOperation({ summary: 'Register a new user' })
    async register(@Body() registerDto: RegisterDto) {
        const userId = await this._userService.register(registerDto);
        return {
            status: HttpStatus.CREATED,
            message: 'User registered successfully',
            id: userId,
        };
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update user details' })
    async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        await this._userService.updateUser(id, updateUserDto)
        return { 
            status: HttpStatus.OK, 
            message: 'User Updated Successfully', 
            id: id 
        }
    }
}