import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Country } from 'src/model/countries.model';
import { CountryLanguage } from 'src/model/language.model';
import {surveyStatus ,questionTypes,deviceTypes} from 'src/constant/constant';
import { CACHE_MANAGER, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class MappingService {
  constructor(
    @InjectModel('Country') private readonly countryModel: Model<Country>,
    @InjectModel('CountryLanguage') private readonly CountryLanguageModel: Model<CountryLanguage>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

 
  async getMetadataFields(fields: string[]): Promise<Record<string, any[]>> {
    try {
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
    } catch (error) {
      console.log(error.message)
      throw new Error(error);
    }
  }

  @CacheKey('cached_cry_data_countries') 
  @CacheTTL(1)
  async getCountriesMetadataFields() {
    console.log("ye aa rha hai kya ?")
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


  @CacheKey('cached_cry_data_languages') 
  @CacheTTL(1)
  public async getLanguageMetadataFields() {
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

  @CacheKey('cached_cry_data_categories') 
  @CacheTTL(1)
  public async getCategoriesMetadataFields(){
    try {
      return ["Has Not Implemented Yet"] // TODO
    } catch (error) {
      console.log(error);
      throw new NotFoundException();
    }
  }
}
