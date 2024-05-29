import { Body, Controller, Delete, Get, Param, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { SupplyService } from './supply.service';
import { DeleteGlobalRedirectURLs } from './DTOs/delete-Global-Redirect-URLs';
import { SetRedirectUrls } from './DTOs/set-Global-Redirect-URLs.dto';

@Controller('supply')
@UsePipes(new ValidationPipe()) 
export class SupplyController {
  constructor(private _supplyService: SupplyService) {}

  @Get('getQuestionsByCountryAndLanguage:countryKey/:language')
  async getQuestionsByCountryAndLanguage(
    @Param('countryKey') countryKey: string,
    @Param('language') language: string,
  ) {
    return await this._supplyService.getQuestionsByCountryAndLanguage();
  }

  @Put('accountUrls')
  async setRedirectUrls(@Body() accountUrlsDto: SetRedirectUrls) {
    return await this._supplyService.setRedirectUrls(accountUrlsDto);
  }

  @Delete('accountUrls')
  async deleteGlobalRedirectURLs(
    @Body() deleteAccountUrlsDto: DeleteGlobalRedirectURLs
  ) {
    return this._supplyService.deleteGlobalRedirectURLs(deleteAccountUrlsDto);
  }
}
