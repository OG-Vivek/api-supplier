import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

interface countryLanguage {
    _id: string; // MongoDB ObjectId
    Code: string;
    Id: string; // Assuming it's a string representation of an ID
    IsActive: boolean;
    Name: string;
    Lng: string;
    cntCode: string;
  }
  
@Schema({ collection: 'country_languages' }) // Set the collection name explicitly
export class CountryLanguage extends Document implements countryLanguage{
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true }) // Use mongoose.Schema.Types.ObjectId for _id
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
