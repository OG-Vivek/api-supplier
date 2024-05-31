import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// interface localization {
//   id:  Number,
//   qId: Number,
//   qKey: String, 
//   cnt: String,
//   lang: String,
//   qTextEng: String,
//   qText: String,
//   display : Number, //  0-customized , 1- Alpha, 2- Randomized
//   st: Number,   // 0=Inactive, 1=Active, 2=Deleted
//   isLocAct: Number,
//   cat : Number[],
//   isTarget : Number,  // 1=Demo/Geo, 0=OtherProfile Questions
//   qOptions : [{
//       id: Number,
//       optTextEng: String,
//       optText:  String,
//       defaultOpt: String,
//       selectOnlyOpt:  String,
//       optScore: Number,
//       optSeq: Number,
//       islock: Boolean,
//       st: Number    // 0=Inactive, 1=Active, 2=Deleted
//   }]
// }


@Schema({ collection: 'localizations' })
export class Localization extends Document{
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  qId: number;

  @Prop({ required: true })
  qKey: string;

  @Prop({ required: true })
  cnt: string;

  @Prop({ required: true })
  lang: string;

  @Prop({ required: true })
  qTextEng: string;

  @Prop({ required: true })
  qText: string;

  @Prop()
  display?: number; // 0-customized , 1- Alpha, 2- Randomized

  @Prop({ default: 1 })
  st: number; // 0=Inactive, 1=Active, 2=Deleted

  @Prop()
  isLocAct?: number;

  @Prop({ type: [Number], required: true })
  cat: number[];

  @Prop({ default: 0 })
  isTarget: number; // 1=Demo/Geo, 0=OtherProfile Questions

  @Prop([
    {
      id: Number,
      optTextEng: String,
      optText: String,
      defaultOpt: String,
      selectOnlyOpt: String,
      optScore: Number,
      optSeq: Number,
      islock: Boolean,
      st: Number // 0=Inactive, 1=Active, 2=Deleted
    }
  ])
  qOptions: {
    id: number;
    optTextEng: string;
    optText: string;
    defaultOpt?: string;
    selectOnlyOpt?: string;
    optScore?: number;
    optSeq?: number;
    islock: boolean;
    st: number;
  }[];
}


@Schema({ collection: 'questions' })
export class Question extends Document {
  @Prop({ required: true })
  id: number;

  @Prop([
    {
      id: Number,
      name: String,
      isPrime: Boolean
    }
  ])
  cat: { id: number; name: string; isPrime: boolean }[];

  @Prop({ required: true })
  qKey: string;

  @Prop({ required: true })
  qText: string;

  @Prop({ required: true })
  qTextNative: string;

  @Prop({ required: true })
  qType: number;

  @Prop({ required: true })
  sortNm: string;

  @Prop({ default: 1 })
  localizeTp: number;

  @Prop({ default: 1 })
  st: number;

  @Prop({ default: 0 })
  isTarget: number;

  @Prop({ default: false })
  isPanel: boolean;

  @Prop({ default: 0 })
  expiry: number;

  @Prop()
  parentQus?: number;

  @Prop()
  lenAllow?: number;

  @Prop({ default: Date.now })
  crtd_on: Date;

  @Prop({ default: Date.now })
  mod_on: Date;
}


export const QuestionSchema = SchemaFactory.createForClass(Question);
export const LocalizationSchema = SchemaFactory.createForClass(Localization);