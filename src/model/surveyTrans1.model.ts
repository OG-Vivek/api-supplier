import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

interface Result {
  termReason: string;
  verifyToken: string;
  ip: string;
  CPI: number;
  clkDateTime: Date;
  st_date_time: Date;
  completeDateTime: Date;
  status: string;
  trackId: string;
  PID: number;
  token: string;
}

interface MainSchema {
  apiStatus: string;
  msg: string;
  result: Result[];
}

@Schema()
export class MainSchemaDocument extends Document implements MainSchema {
  @Prop({ required: true })
  apiStatus: string;

  @Prop({ required: true })
  msg: string;

  @Prop({ type: [{ type: Object }], required: true })
  result: Result[];
}

export const MainSchemaSchema =
  SchemaFactory.createForClass(MainSchemaDocument);
