import { Body, Controller, Delete, Get, Param, Put, UsePipes, ValidationPipe, Headers,  BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { SupplyService } from './supply.service';
import { DeleteGlobalRedirectURLs } from './DTOs/delete-Global-Redirect-URLs';
import { SetRedirectUrls } from './DTOs/set-Global-Redirect-URLs.dto';
import { GetQuestionsDto } from './DTOs/lookup-Question-Library.dto';

@Controller('supply')
@UsePipes(new ValidationPipe()) 
export class SupplyController {
  constructor(private _supplyService: SupplyService) {}
  

  @Get('getQuestionsByCountryAndLanguage/:countryKey/:language')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getQuestionsByCountryAndLanguage(
    @Param() params: GetQuestionsDto,
    @Headers('x-access-token') accessToken: string
  ): Promise<any> {
    const { countryKey, language } = params;

    if (!accessToken) {
      throw new BadRequestException('x-access-token is required');
    }
    return this._supplyService.getQuestionsByCountryAndLanguage(countryKey, language);
  }

  @Put('accountUrls')
  async setRedirectUrls(
    @Body() accountUrlsDto: SetRedirectUrls,
    @Headers('x-access-token') accessToken: string
  ): Promise<any> {
    if (!accessToken) {
      throw new BadRequestException('x-access-token is required');
    }
    return await this._supplyService.setRedirectUrls(accountUrlsDto);
  }

  @Delete('accountUrls')
  async deleteGlobalRedirectURLs(
    @Body() deleteAccountUrlsDto: DeleteGlobalRedirectURLs
  ) {
    return this._supplyService.deleteGlobalRedirectURLs(deleteAccountUrlsDto);
  }
}



