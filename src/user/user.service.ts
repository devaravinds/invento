import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { RegisterDto, UpdateUserDto } from "./user.dto";
import { Model } from "mongoose";
import { User, UserDocument } from "./user.entity";
import { BaseService } from "src/base/base.service";
import { InjectModel } from "@nestjs/mongoose";
import { AuthenticationServiceHelper } from "src/authentication/authentication.service.helper";
import { OrganizationService } from "src/organization/organization.service";
import { InvitationStatus, UserRoles } from "./user.enum";

@Injectable()
export class UserService extends BaseService<UserDocument> {
    constructor(
        @InjectModel(User.name)
        private readonly _userRepository: Model<UserDocument>,
        private readonly _organizationService: OrganizationService
    ) {
        super(_userRepository);
    }
    async register(registerDto: RegisterDto): Promise<string> {
        if(await this.emailOrPhoneExists(registerDto.email, registerDto.phone)) {
            throw new BadRequestException('Email or phone already exists');
        }
        const newUser: User = {
            phone: registerDto.phone,
            password: AuthenticationServiceHelper.hash(registerDto.password),
            firstName: registerDto.firstName,
            lastName: registerDto.lastName,
            email: registerDto.email,
        }
        try {
            const createdUser =  await this._userRepository.create(newUser);
            return createdUser._id.toString();
        } catch (error) {
            throw new InternalServerErrorException(`Error registering user: ${error.message}`);
        }
    }

    async emailOrPhoneExists(email: string, phone: string): Promise<boolean> {
        try {
            const user = await this._userRepository.findOne({ $or: [{ email }, { phone }] });
            return !!user;
        } catch (error) {
            throw new InternalServerErrorException(`Error checking email or phone existence: ${error.message}`);
        }
    }

    async updateUser(id: string, updateDto: UpdateUserDto): Promise<string> {
      try {
        const userExists = await this.checkExists(id);
        if (!userExists) {
          throw new NotFoundException("User not found")
        }
      } catch (error) {
        throw new InternalServerErrorException(`Error checking user existence: ${error.message}`);
      }
      try {
        const updatedUser = await this._userRepository.findByIdAndUpdate(id, updateDto);
        return updatedUser._id.toString();
      }
      catch (error) {
        throw new InternalServerErrorException(`Error updating user: ${error.message}`);
      }    
    }

    async inviteUserToOrganization(userId: any, organizationId: string, role?: UserRoles): Promise<void> {
        try {
          const [existingOrganization, existingUser] = await Promise.all([
            this._organizationService.checkExists(organizationId),
            this.getById(userId)
          ])
          if(!existingOrganization) {
            throw new BadRequestException(`Organization with ID ${organizationId} does not exist.`);
          }
          if(!existingUser) {
            throw new BadRequestException(`User with ID ${userId} does not exist.`);
          }
          if(existingUser.roles.some(role => role.organizationId === organizationId && role.invitationStatus != InvitationStatus.REJECTED)) {
            throw new BadRequestException(`User with ID ${userId} is already invited to organization with ID ${organizationId}`);
          }
        }
        catch (error) {
            throw new InternalServerErrorException(`Error checking organization/user existence: ${error.message}`);
        }
        try {
          await this._userRepository.findByIdAndUpdate(
            { _id: userId }, 
            {
              $push: {
                 roles: { organizationId, role , invitationStatus: InvitationStatus.PENDING} 
                } 
            }
          ); 
        }
        catch (error) {
            throw new InternalServerErrorException(`Error inviting user to organization: ${error.message}`);
        }
    }

    async updateInvitationStatus(userId: string, organizationId: string, invitationStatus: InvitationStatus): Promise<void> {
        try {
          const [existingOrganization, existingUser] = await Promise.all([
            this._organizationService.checkExists(organizationId),
            this.getById(userId)
          ])
          if(!existingOrganization) {
            throw new BadRequestException(`Organization with ID ${organizationId} does not exist.`);
          }
          if(!existingUser) {
            throw new BadRequestException(`User with ID ${userId} does not exist.`);
          }
        }
        catch (error) {
            throw new InternalServerErrorException(`Error checking organization/user existence: ${error.message}`);
        }

        try {
          const updatedUser = await this._userRepository.findOneAndUpdate(
            { _id: userId, "roles.organizationId": organizationId },
            { $set: { "roles.$.invitationStatus": invitationStatus } },
            { new: true }
          );
          if (!updatedUser) {
            throw new BadRequestException(`User with ID ${userId} is not invited to organization with ID ${organizationId}`);
          }
        } catch (error) {
          throw new InternalServerErrorException(`Error accepting invitation: ${error.message}`);
        }
    }
}