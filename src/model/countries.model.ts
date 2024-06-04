import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

interface ValidRange {
  min: number;
  max: number;
}

interface Language {
  _id: string; 
  name: string;
  id: number;
  primary?: number; 
}


interface country {
  _id: string;
  ShortCode: string;
  status: number;
  states: any[]; 
  ageMin: number;
  id: number;
  postalCodeTargetingEnabled: boolean;
  regionTypes: any[]; 
  validIncidenceRateRange: ValidRange;
  validLengthOfInterviewRange: ValidRange;
  language: Language[];
  currency: string;
  cintPanelId: string;
}

@Schema()
export class Country extends Document implements country {
  @Prop({ type: String, required: true})
  _id: string;

  @Prop({ required: true })
  ShortCode: string;

  @Prop({ required: true })
  status: number;

  @Prop({ type: Array })
  states: any[];

  @Prop({ required: true })
  ageMin: number;

  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  postalCodeTargetingEnabled: boolean;

  @Prop({ type: Array })
  regionTypes: any[];

  @Prop({ type: Object, required: true })
  validIncidenceRateRange: ValidRange;

  @Prop({ type: Object, required: true })
  validLengthOfInterviewRange: ValidRange;

  @Prop({ type: [{ type: Object }], required: true })
  language: Language[];

  @Prop({ required: true })
  currency: string;

  @Prop({ required: true })
  cintPanelId: string;
}

export const CountrySchema = SchemaFactory.createForClass(Country);
