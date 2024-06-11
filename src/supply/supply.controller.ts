import { Body, Controller, Res ,Delete, Get, Param,Query ,Put, UsePipes, ValidationPipe, Headers,  BadRequestException, HttpException, HttpStatus, InternalServerErrorException, UseInterceptors, Req } from '@nestjs/common';
import { SupplyService } from './supply.service';
import { DeleteGlobalRedirectURLs } from './DTOs/delete-Global-Redirect-URLs';
import { SetRedirectUrls } from './DTOs/set-Global-Redirect-URLs.dto';
import { GetQuestionsDto } from './DTOs/lookup-Question-Library.dto';
import { GetAnswerDto } from './DTOs/answer-lookup.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { IntegerType } from 'mongodb';
import { Response,Request } from 'express';

// @UseInterceptors(CacheInterceptor)
@Controller('supply')
@UsePipes(new ValidationPipe())
export class SupplyController {
  constructor(private _supplyService: SupplyService) {}
  
  @Get('getQuestionsByCountryAndLanguage/:countryKey/:language')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getQuestionsByCountryAndLanguage(
    @Param() params: GetQuestionsDto
  ): Promise<any> {
    const { countryKey, language } = params;

    try {
      const result = await this._supplyService.getQuestionsByCountryAndLanguage(countryKey, language);
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException('An error occurred while fetching questions', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }  
  }

  @Put('setRedirectUrls')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async setRedirectUrls(
    @Body() accountUrlsDto: SetRedirectUrls
  ): Promise<any> {
    const isEmpty = Object.values(accountUrlsDto).every(value => value === null || value === undefined);
    if (isEmpty) {
      throw new BadRequestException('At least one key must be provided with a non-null value');
    }

    try {
      const result = await this._supplyService.setRedirectUrls(accountUrlsDto);
      return result;
    } catch (error) {
      throw new InternalServerErrorException('Could not set redirect URLs');
    }
  }

  @Get('getAllocatedSurveys')
  async getAllocatedSurveys(@Req() req:Request) {
    try {
      const supId = req.headers.user as string;
      let supIdToFind :number = parseInt(supId);
      supIdToFind = 111  //TODO : remove this when we have token
      return await this._supplyService.getAllocatedSurveys(supIdToFind);
    } catch (error) {
      return new Error()
    }
  }


  @Get('getAnswersByQuesKey/:questionKey')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true  }))
  async getAnswersByQuestionKey(
    @Param('questionKey') questionKey: string,
    @Query() queryParams: GetAnswerDto

  ): Promise<any> {
    const { country, language } = queryParams;

    if(!country){
      throw new BadRequestException("Country is required");
    }

    if(!language){
      throw new BadRequestException("Language is required");
    }

    try{
      const result = await this._supplyService.getAnswersByQuestionKey(questionKey, country, language);
      return result;
    } catch (error){
      if (error instanceof HttpException) {
        throw error;
      } else{
        throw new HttpException('An error occurred while fetching answers', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }  
  }

  @Put('setRedirectionForSurvey/:surveyId')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async setRedirectionForSurvey(
    @Body() accountUrlsDto: SetRedirectUrls,
    @Param('surveyId') surveyId: number
  ): Promise<any> {

    const isEmpty = Object.values(accountUrlsDto).every(value => value === null || value === undefined);
    if (isEmpty) {
      throw new BadRequestException('At least one key must be provided with a non-null value');
    }

    try {
      const result = await this._supplyService.setRedirectionForSurvey(accountUrlsDto, surveyId);
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else{
        throw new HttpException('Could not set redirect URLs', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }


}



