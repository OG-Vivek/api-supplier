import { Module } from "@nestjs/common";
import { ResourcesService } from "./resources.service";
import { ResourcesController } from "./resources.controller";

@Module({
    imports: [],
    controllers: [ResourcesController],
    providers: [ResourcesService],
    exports: []
})

export class ResourcesModule{}