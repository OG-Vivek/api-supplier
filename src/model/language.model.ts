import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

interface countryLanguage {
    _id: string; 
    Code: string;
    Id: string; 
    IsActive: boolean;
    Name: string;
    Lng: string;
    cntCode: string;
  }
  
@Schema({ collection: 'country_languages' }) 
export class CountryLanguage extends Document implements countryLanguage{
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true }) 
  _id: string;

  @Prop({ required: true })
  Code: string;

  @Prop({ required: true })
  Id: string;

  @Prop({ required: true })
  IsActive: boolean;

  @Prop({ required: true })
  Name: string;

  @Prop({ required: true })
  Lng: string;

  @Prop({ required: true })
  cntCode: string;
}

export const CountryLanguageSchema = SchemaFactory.createForClass(CountryLanguage);
