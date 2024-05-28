import { Module } from "@nestjs/common";
import { MappingService } from "./mapping.service";
import { MappingController } from "./mapping.controller";

@Module({
    imports: [],
    controllers: [MappingController],
    providers: [MappingService],
    exports: []
})

export class MappingModule {}