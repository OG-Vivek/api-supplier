import { Module } from "@nestjs/common";
import { MappingService } from "./mapping.service";
import { MappingController } from "./mapping.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Country, CountrySchema } from "src/model/countries.model";
import { CountryLanguage, CountryLanguageSchema } from "src/model/language.model";
import { DatabaseModule } from "src/database/database.module";

@Module({
    imports: [
        DatabaseModule,
        MongooseModule.forFeature([{ name: Country.name, schema: CountrySchema }]),
        MongooseModule.forFeature([{ name: CountryLanguage.name, schema: CountryLanguageSchema }]),
    ],
    controllers: [MappingController],
    providers: [MappingService],
    exports: []
})

export class MappingModule {}