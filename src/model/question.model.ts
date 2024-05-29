import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

interface Question {
  QuestionId: string;
  QuestionText: string;
  QuestionKey: string;
  QuestionType: string;
  language: string;
  Category: string;
}

interface QuestionModel {
  apiStatus: string;
  msg: string;
  result: Question[];
}

@Schema()
export class QuestionModelDocument extends Document implements QuestionModel {
  @Prop({ required: true })
  apiStatus: string;

  @Prop({ required: true })
  msg: string;

  @Prop({ type: [{ type: Object }], required: true })
  result: Question[];
}

export const QuestionModelSchema = SchemaFactory.createForClass(
  QuestionModelDocument,
);
