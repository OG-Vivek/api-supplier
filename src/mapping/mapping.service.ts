import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Country } from 'src/model/countries.model';
import { CountryLanguage } from 'src/model/language.model';
import {surveyStatus ,questionTypes,deviceTypes} from 'src/constant/constant';

@Injectable()
export class MappingService {
  constructor(
    @InjectModel('Country') private readonly countryModel: Model<Country>,
    @InjectModel('CountryLanguage') private readonly CountryLanguageModel: Model<CountryLanguage>,
  ) {}

 
  async getMetadataFields(fields: string[]): Promise<Record<string, any[]>> {
    const result: Record<string, any[]> = {};
    const allowedFields = ['country', 'language', 'deviceType', 'categories','surveyStatus','questionType']; 
    for (const field of allowedFields) {
      if (fields.includes(field)) {
        switch (field) {
          case 'country':
            result.countries = await this.getCountriesMetadataFields();
            break;
          case 'language':
            result.languages = await this.getLanguageMetadataFields();
            break;
          case 'deviceType':
            result.deviceTypes = deviceTypes;  
            break;
          case 'categories':
            result.categories = await this.getCategoriesMetadataFields();  
            break;
          case 'surveyStatus':
            result.surveyStatus = surveyStatus; 
            break;
          case 'questionType':
            result.questionTypes = questionTypes; 
            break;
        }
      } else {
        result[field] = []; 
      }
    }
    return result;
  }

  private async getCountriesMetadataFields() {
    try {
      const countries = await this.countryModel
        .find()
        .select('_id ShortCode')
        .exec();
      return countries.map((country) => ({
        name: country._id,
        code: country.ShortCode,
      }));
    } catch (error) {
      console.log(error);
      throw new NotFoundException();
    }
  }

  private async getLanguageMetadataFields() {
    try {
      const languages = await this.CountryLanguageModel.find()
        .select('Code Lng')
        .exec();
      return languages.map((language) => ({
        name: language.Lng,
        code: language.Code,
      }));
    } catch (error) {
      console.log(error);
      throw new NotFoundException();
    }
  }

  private async getCategoriesMetadataFields(){
    try {
      return ["Has Not Implemented Yet"]
    } catch (error) {
      console.log(error);
      throw new NotFoundException();
    }
  }
}
