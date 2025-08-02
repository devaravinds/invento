import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "./user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { JwtService } from "@nestjs/jwt";
import { OrganizationService } from "src/organization/organization.service";
import { OrganizationModule } from "src/organization/organization.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'User', schema: UserSchema }
        ]),
        OrganizationModule
    ],
    controllers: [UserController],
    providers: [
        UserService, 
        JwtService,
    ],
})

export class UserModule {}