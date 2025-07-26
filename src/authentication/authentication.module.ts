import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "src/user/user.entity";
import { AuthenticationController } from "./authentication.controller";
import { AuthenticationService } from "./authentication.service";
import { JwtService } from "@nestjs/jwt";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'User', schema: UserSchema }
        ])
    ],    
    controllers: [AuthenticationController],
    providers: [AuthenticationService, JwtService],
    exports: []
})
export class AuthenticationModule {}