import { Module } from "@nestjs/common";
import { PartnerController } from "./partner.controller";
import { PartnerService } from "./partner.service";
import { JwtService } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Partner } from "./partner.entity";

@Module({
    imports: [
      TypeOrmModule.forFeature([Partner]),
    ],
    controllers: [PartnerController],
    providers: [PartnerService, JwtService],
    exports: []
})

export class PartnerModule {}