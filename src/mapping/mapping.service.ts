import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Country } from 'src/model/countries.model';
import { CountryLanguage } from 'src/model/language.model';

@Injectable()
export class MappingService {
  constructor(
    @InjectModel('Country') private readonly countryModel: Model<Country>,
    @InjectModel('CountryLanguage') private readonly CountryLanguageModel: Model<CountryLanguage>,
  ) {}

  async getMetadataFields(fields: string[]){
    
  }

  async getCountries() {
    const countries = await this.countryModel
      .find()
      .select('_id ShortCode')
      .exec();
    const formattedCountries = countries.map((country) => ({
      name: country._id,
      code: country.ShortCode,
    }));

    return { countries: formattedCountries };
  }

  async getLanguage() {
    const countries = await this.CountryLanguageModel.find()
      .select('Code Lng')
      .exec();
    const formattedCountries = countries.map((country) => ({
      name: country.Lng,
      code: country.Code,
    }));

    return { countries: formattedCountries };
  }
}
