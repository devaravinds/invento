import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { RegisterDto, UpdateUserDto } from "./user.dto";
import { User } from "./user.entity";
import { BaseService } from "src/base/base.service";
import { AuthenticationServiceHelper } from "src/authentication/authentication.service.helper";
import { OrganizationService } from "src/organization/organization.service";
import { InvitationStatus, UserRoles } from "./user.enum";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Role } from "./role.entity";

@Injectable()
export class UserService extends BaseService<User> {
    constructor(
        @InjectRepository(User)
        private readonly _userRepository: Repository<User>,
        @InjectRepository(Role)
        private readonly _roleRepository: Repository<Role>,
        private readonly _organizationService: OrganizationService
    ) {
        super(_userRepository);
    }
    async register(registerDto: RegisterDto): Promise<string> {
        if(await this.emailOrPhoneExists(registerDto.email, registerDto.phone)) {
            throw new BadRequestException('Email or phone already exists');
        }
        try {
            const createdUser =  await this._userRepository.create({
              phone: registerDto.phone,
              password: AuthenticationServiceHelper.hash(registerDto.password),
              firstName: registerDto.firstName,
              lastName: registerDto.lastName,
              email: registerDto.email,
            });
            return createdUser.id.toString();
        } catch (error) {
            throw new InternalServerErrorException(`Error registering user: ${error.message}`);
        }
    }

    async emailOrPhoneExists(email: string, phone: string): Promise<boolean> {
        try {
            const user = await this._userRepository.findOne({ where: [{ email }, { phone }]});
            return !!user;
        } catch (error) {
            throw new InternalServerErrorException(`Error checking email or phone existence: ${error.message}`);
        }
    }

    async updateUser(id: number, updateDto: UpdateUserDto): Promise<string> {
      try {
        const userExists = await this.checkExists(id);
        if (!userExists) {
          throw new NotFoundException("User not found")
        }
      } catch (error) {
        throw new InternalServerErrorException(`Error checking user existence: ${error.message}`);
      }
      try {
        const updatedUser = await this._userRepository.update(id, updateDto);
        return updatedUser.raw.id.toString();
      }
      catch (error) {
        throw new InternalServerErrorException(`Error updating user: ${error.message}`);
      }    
    }

    async inviteUserToOrganization(userId: any, organizationId: number, role?: UserRoles): Promise<void> {
        try {
          const existingOrganization = await this._organizationService.checkExists(organizationId);
          const existingUser = await this._userRepository.findOne({
            where: { id: userId },
            relations: ['roles', 'roles.organization'],
          });
          if(!existingOrganization) {
            throw new BadRequestException(`Organization with ID ${organizationId} does not exist.`);
          }
          if(!existingUser) {
            throw new BadRequestException(`User with ID ${userId} does not exist.`);
          }
          if(existingUser.roles.some(role => role.organization.id === organizationId && role.invitationStatus != InvitationStatus.REJECTED)) {
            throw new BadRequestException(`User with ID ${userId} is already invited to organization with ID ${organizationId}`);
          }
        }
        catch (error) {
            throw new InternalServerErrorException(`Error checking organization/user existence: ${error.message}`);
        }
        try {
          await this._roleRepository.save({
            role: role,
            organizationId: organizationId,
            invitationStatus: InvitationStatus.PENDING,
            user: { id: userId } as User,
          }); 
        }
        catch (error) {
            throw new InternalServerErrorException(`Error inviting user to organization: ${error.message}`);
        }
    }

    async updateInvitationStatus(userId: number, organizationId: number, invitationStatus: InvitationStatus): Promise<void> {
        try {
          const existingOrganization = await this._organizationService.checkExists(organizationId);
          const existingUser = await this._userRepository.findOne({
            where: { id: userId },
            relations: ['roles', 'roles.organization'],
          })
          if(!existingOrganization) {
            throw new BadRequestException(`Organization with ID ${organizationId} does not exist.`);
          }
          if(!existingUser) {
            throw new BadRequestException(`User with ID ${userId} does not exist.`);
          }
          const role = existingUser.roles.find(role => role.organization.id === organizationId);
          if (!role) {
            throw new BadRequestException(`User with ID ${userId} is not invited to organization with ID ${organizationId}`);
          }
        }
        catch (error) {
            throw new InternalServerErrorException(`Error checking organization/user existence: ${error.message}`);
        }

        try {
          const updatedRole = await this._roleRepository.update(
            { 
              organization: { id: organizationId },
              user: { id: userId }
            },
            { invitationStatus }
          );
          if (!updatedRole) {
            throw new BadRequestException(`User with ID ${userId} is not invited to organization with ID ${organizationId}`);
          }
        } catch (error) {
          throw new InternalServerErrorException(`Error accepting invitation: ${error.message}`);
        }
    }
}