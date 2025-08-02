import { InjectModel } from "@nestjs/mongoose";
import { LoginDto, LoginResponse } from "./authentication.dto";
import { User } from "src/user/user.entity";
import { Model } from "mongoose";
import { BadRequestException } from "@nestjs/common";
import { AuthenticationServiceHelper } from "./authentication.service.helper";
import { JwtService } from "@nestjs/jwt";
import { JwtConfig } from "src/config/jwt.config";
import { Algorithm } from 'jsonwebtoken';


export class AuthenticationService {
    constructor(
        @InjectModel(User.name)
        private readonly _userRepository: Model<User>,
        private readonly _jwtService: JwtService

    ) {}

    async login(loginDto: LoginDto): Promise<LoginResponse> {
        
        const { phone, password } = loginDto;
        const user = await this._userRepository.findOne({ phone: phone });
        if (!user) {
            throw new BadRequestException('User not found with the provided phone number.');
        }
        const hashedPassword = user.password;
        const isPasswordValid = AuthenticationServiceHelper.isPasswordValid(password, hashedPassword);
        if (!isPasswordValid) {
            throw new BadRequestException('Invalid password provided.');
        }
        const { secretKeyAccessToken, algorithm, ttlAccessToken } = JwtConfig;
        
        const token = this._jwtService.sign(
            { 
                id: user.id,
                roles: user.roles,
                isSuperAdmin: user.isSuperAdmin
            },
            {
                secret: secretKeyAccessToken,
                expiresIn: ttlAccessToken,
                algorithm: algorithm as Algorithm,
            },
        );
        return AuthenticationServiceHelper.createLoginResponse(user, token);
    }
}