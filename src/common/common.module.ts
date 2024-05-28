import { Module } from "@nestjs/common";
import { CommonController } from "./common.controller";
import { CommonService } from "./common.service";
import { DatabaseModule } from "src/database/database.module";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/model/user.model";

@Module({
    imports: [
        DatabaseModule,
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
    controllers: [CommonController],
    providers: [CommonService],
})
export class CommonModule{}