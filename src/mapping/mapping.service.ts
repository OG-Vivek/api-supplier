import {  Injectable, NotFoundException } from '@nestjs/common';
import {surveyStatus ,questionTypes,deviceTypes} from 'src/constant/constant';
import {  CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { CollectionNames, Database } from 'src/utils/enums';
import { DataBaseService } from 'src/database/database.service';

@Injectable()
export class MappingService {
  constructor(
    private readonly dbService: DataBaseService 
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
  async getCountriesMetadataFields(){  
    try {
      let query = {
        dbName:Database.dbName,
        collectionName:CollectionNames.Countries,
        query: {},
        projection: {
          "_id": 1,
          "ShortCode": 1,
        },
      }
      let countries:any = await this.dbService.findMany(query);
      return countries.map((country) => ({
        name: country._id,
        code: country.ShortCode,
      }));
    } catch (error) {
      console.error(error);
      throw NotFoundException;
    }
  }

  @CacheKey('cached_cry_data_languages') 
  @CacheTTL(1)
  public async getLanguageMetadataFields() {
    try {
      let query = {
        dbName:Database.dbName,
        collectionName:CollectionNames.CountryLanguages,
        query: {},
        projection: {
          "Code": 1,
          "Lng": 1,
        },
      }
      let languages:any = await this.dbService.findMany(query);
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
