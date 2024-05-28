import { Body, Controller, Get, Post, Res, UsePipes, ValidationPipe } from "@nestjs/common";
import { CommonService } from "./common.service";
import { Response ,Request} from 'express';
@Controller()
export class CommonController{
    constructor(private _commonService:CommonService){};

    @Post('/test')
    @UsePipes(new ValidationPipe({ transform: true }))
    async createUser(@Body() userRegistration: any) {
      try {
        return await this._commonService.createNewUser(userRegistration);
      } catch (err) {
        console.log(err);
        return 
      }
    }

    @Get()
    async gettAllCountries(@Res() response:Response){
        return await this._commonService.getAllCountries();
    }
}