import { Module } from "@nestjs/common";
import { User } from "./user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { JwtService } from "@nestjs/jwt";
import { OrganizationModule } from "src/organization/organization.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Role } from "./role.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Role]),
        OrganizationModule
    ],
    controllers: [UserController],
    providers: [
        UserService, 
        JwtService,
    ],
})

export class UserModule {}