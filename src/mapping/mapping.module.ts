import { Module } from "@nestjs/common";
import { MappingService } from "./mapping.service";
import { MappingController } from "./mapping.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { DatabaseModule } from "src/database/database.module";

@Module({
    imports: [
        DatabaseModule,
    ],
    controllers: [MappingController],
    providers: [MappingService],
    exports: []
})

export class MappingModule {}