import { Module } from "@nestjs/common";
import { SupplyService } from "./supply.service";
import { SupplyController } from "./supply.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Supply, SupplySchema } from "src/model/supply.model";
import { Localization, LocalizationSchema, Question, QuestionSchema } from "src/model/questionLibrary.model"
import { UrlSchema, Url } from "src/model/globalUrl.model"

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Supply.name, schema: SupplySchema },
    { name: Localization.name, schema: LocalizationSchema },
    { name: Question.name, schema: QuestionSchema },
    { name: Url.name, schema: UrlSchema },
    ])
],
    controllers: [SupplyController],
    providers: [SupplyService],
    exports: [],
})

export class SupplyModule { }