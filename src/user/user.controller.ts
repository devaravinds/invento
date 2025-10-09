import { Body, Controller, Get, HttpStatus, Param, Patch, Post, Put, Query, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/authentication/authentication.guard";
import { UserService } from "./user.service";
import { RegisterDto, UpdateUserDto } from "./user.dto";
import { OrganizationIdExempted, Roles } from "src/authentication/authentication.decorator";
import { InvitationStatus, UserRoles } from "./user.enum";

@Controller('users')
@ApiTags('User APIs')
@ApiBearerAuth('bearer')
@UseGuards(AuthGuard)
export class UserController {
    constructor(private readonly _userService: UserService) { }

    @Post('register')
    @Roles(UserRoles.SUPER_ADMIN)
    @ApiOperation({ summary: 'Register a new user' })
    @OrganizationIdExempted()
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
    @Roles(UserRoles.ADMIN, UserRoles.SUPER_ADMIN)
    async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        await this._userService.updateUser(id, updateUserDto)
        return { 
            status: HttpStatus.OK, 
            message: 'User Updated Successfully', 
            id: id 
        }
    }

    @Patch(':id/invite-to-organization/')
    @ApiOperation({ summary: 'Invite user to organization' })
    @Roles(UserRoles.ADMIN, UserRoles.SUPER_ADMIN)
    @ApiHeader({ name: 'organization-id', required: true, description: 'Organization ID' })
    @ApiQuery({name: 'role', required: false, enum: UserRoles})
    async inviteUserToOrganization(@Request() apiRequest, @Param('id') id: string, @Query('role')role?: UserRoles) {
        const organizationId = apiRequest.organizationId;
        await this._userService.inviteUserToOrganization(id, organizationId, role);
        return {
            status: HttpStatus.OK,
            message: 'User invited to organization successfully',
            id: id,
        };
    }

    @Patch('update-invitation-status')
    @ApiOperation({ summary: 'Update invitation status to organization' })
    @ApiHeader({ name: 'organization-id', required: true, description: 'Organization ID' })
    @ApiQuery({ name: 'status', required: true, enum: InvitationStatus })
    async updateInvitationStatus(@Request() apiRequest, @Query('status') invitationStatus: InvitationStatus) {
        const organizationId = apiRequest.organizationId;
        const userId = apiRequest.user.id
        await this._userService.updateInvitationStatus(userId, organizationId, invitationStatus);
        return {
            status: HttpStatus.OK,
            message: 'Invitation accepted successfully',
            id: userId,
        };
    }

    @Get('/current/organizations')
    @ApiOperation({ summary: 'Get all organizations for the current user' })
    @OrganizationIdExempted()
    async getCurrentUsersOrganizations(@Request() apiRequest) {
        const userId = apiRequest.user.id;
        const organizations = await this._userService.getCurrentUsersOrganizations(userId);
        return {
            status: HttpStatus.OK,
            message: 'Organizations retrieved successfully',
            data: organizations,
        };
    }

    @Get()
    @ApiOperation({ summary: 'Get all users' })
    @Roles(UserRoles.SUPER_ADMIN)
    @OrganizationIdExempted()
    async getAllUsers() {
        const users = await this._userService.getAllUsers();
        return {
            status: HttpStatus.OK,
            message: 'Users retrieved successfully',
            data: users,
        };
    }
}