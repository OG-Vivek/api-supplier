import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

interface ResultItem {
  termReason: string;
  verifyToken: string;
  ip: string;
  CPI: number;
  clkDateTime: Date;
  st_date_time: Date;
  completeDateTime: Date;
  status: string;
  trackId: string;
  id: number;
  grp: {};
  PID: number;
  surveyId: number;
}

interface ApiResponse {
  apiStatus: string;
  msg: string;
  result: ResultItem[];
}

@Schema()
export class ApiResponseDocument extends Document implements ApiResponse {
  @Prop({ required: true })
  apiStatus: string;

  @Prop({ required: true })
  msg: string;

  @Prop({ type: [{ type: Object }], required: true })
  result: ResultItem[];
}

export const ApiResponseSchema =
  SchemaFactory.createForClass(ApiResponseDocument);
