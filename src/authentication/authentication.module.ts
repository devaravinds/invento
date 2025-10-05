import { Module } from "@nestjs/common";
import { AuthenticationController } from "./authentication.controller";
import { AuthenticationService } from "./authentication.service";
import { JwtService } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/user/user.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
    ],    
    controllers: [AuthenticationController],
    providers: [AuthenticationService, JwtService],
    exports: []
})
export class AuthenticationModule {}