import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { RegisterDto } from "./user.dto";
import { Model } from "mongoose";
import { User, UserDocument } from "./user.entity";
import { BaseService } from "src/base/base.service";
import { InjectModel } from "@nestjs/mongoose";
import { AuthenticationServiceHelper } from "src/authentication/authentication.service.helper";

@Injectable()
export class UserService extends BaseService<UserDocument> {
    constructor(
        @InjectModel(User.name)
        private readonly _userRepository: Model<UserDocument>    
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
}