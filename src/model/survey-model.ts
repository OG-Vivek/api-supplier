import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

interface SurveyResult {
  surveyId: number;
  surveyName: string;
  N: number;
  isRevShr: boolean;
  supCmps: number;
  remainingN: number;
  LOI: number;
  IR: number;
  Country: string;
  CountryCode: string;
  Language: string;
  LanguageCode: string;
  groupType: string;
  deviceType: string;
  createdDate: string;
  modifiedDate: string;
  reContact: boolean;
  entryLink: string;
  testEntryLink: string;
  CPI: string;
  isQuota: boolean;
  jobCategory: string;
  isPIIRequired: boolean;
  JobId: number;
  BuyerId: number;
  expected_end_date: string;
  duplicateSurveyIds: number[];
  duplicateCheckLevel: string;
  statuses: string[];
  numberOfCompletes: number;
  numberOfStarts: number;
  globalBuyerConversion: string;
  globalMedianLOI: string;
}

interface SurveyModel {
  apiStatus: string;
  msg: string;
  result: SurveyResult;
}

@Schema()
export class SurveyModelDocument extends Document implements SurveyModel {
  @Prop({ required: true })
  apiStatus: string;

  @Prop({ required: true })
  msg: string;

  @Prop({ type: Object, required: true })
  result: SurveyResult;
}

export const SurveyModelSchema =
  SchemaFactory.createForClass(SurveyModelDocument);
