import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PartnerSchema } from "./partner.entity";
import { PartnerController } from "./partner.controller";
import { PartnerService } from "./partner.service";
import { JwtService } from "@nestjs/jwt";

@Module({
    imports: [
      MongooseModule.forFeature([
        { name: 'Partner', schema: PartnerSchema }
      ])
    ],
    controllers: [PartnerController],
    providers: [PartnerService, JwtService],
    exports: []
})

export class PartnerModule {}