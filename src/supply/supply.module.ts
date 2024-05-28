import { Module } from "@nestjs/common";
import { SupplyService } from "./supply.service";
import { SupplyController } from "./supply.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Supply, SupplySchema } from "src/model/supply.model";

@Module({
    imports: [ MongooseModule.forFeature([{ name: Supply.name, schema: SupplySchema }]),],
    controllers: [SupplyController],
    providers: [SupplyService],
    exports: [],
})

export class SupplyModule {}