import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

interface globalUrl{
    id ?: Number,
    sUrl ?: string, 
    fUrl ?: string,
    qTUrl ?: string,
    oUrl ?: string,
    tUrl ?: string,
    pstbck ?: string,
    pstbck_fail ?:string
}

@Schema({ collection: 'suppliers' })
export class Url extends Document {

  @Prop({ type: Number, required: true })
  id: number;

  @Prop({ type: String, required: false })
  sUrl: string;

  @Prop({ type: String, required: false })
  fUrl: string;

  @Prop({ type: String, required: false })
  qTUrl: string;

  @Prop({ type: String, required: false })
  oUrl: string;

  @Prop({ type: String, required: false })
  tUrl: string;

  @Prop({ type: String, required: false })
  pstbck: string;

  @Prop({ type: String, required: false })
  pstbck_fail: string;
}

export const UrlSchema = SchemaFactory.createForClass(Url);
