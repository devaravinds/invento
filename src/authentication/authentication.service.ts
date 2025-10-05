import { LoginDto, LoginResponse } from "./authentication.dto";
import { User } from "src/user/user.entity";
import { BadRequestException } from "@nestjs/common";
import { AuthenticationServiceHelper } from "./authentication.service.helper";
import { JwtService } from "@nestjs/jwt";
import { JwtConfig } from "src/config/jwt.config";
import { Algorithm } from 'jsonwebtoken';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RegisterDto } from "src/user/user.dto";
import { SUPER_ADMIN_SECRET_KEY } from "src/config/system.config";


export class AuthenticationService {
    constructor(
        @InjectRepository(User)
        private readonly _userRepository: Repository<User>,
        private readonly _jwtService: JwtService,

    ) {}

    async login(loginDto: LoginDto): Promise<LoginResponse> {
        
        const { phone, password } = loginDto;
        const user = await this._userRepository.findOne({where: { phone }});
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

    async createSuperAdmin(secretKey: string, registerDto: RegisterDto) {
        if ( secretKey != SUPER_ADMIN_SECRET_KEY) {
            throw new BadRequestException('Invalid secret key provided.');
        }

        await this._userRepository.save({
            phone: registerDto.phone,
            password: AuthenticationServiceHelper.hash(registerDto.password),
            firstName: registerDto.firstName,
            lastName: registerDto.lastName,
            email: registerDto.email,
            isSuperAdmin: true,
        })

    }
}