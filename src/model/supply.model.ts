import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

interface Result {
    termReason: string;
    verifyToken: string;
    ip: string;
    CPI: string;
    clkDateTime: string;
    st_date_time: string;
    completeDateTime: string;
    status: string;
    trackId: string;
    PID: string;
    token: string;
  }
  
  interface MainSchema {
    apiStatus: string;
    msg: string;
    result: Result[];
  }

  
@Schema()
export class Supply extends Document implements MainSchema {
  @Prop({ required: true })
  apiStatus: string;

  @Prop({ required: true })
  msg: string;

  @Prop({ type: [{ type: Object }], required: true })
  result: Result[]; 
}

export const SupplySchema = SchemaFactory.createForClass(Supply);
