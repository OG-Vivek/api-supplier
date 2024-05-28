import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail } from 'class-validator';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true, lowercase: true })
  @IsEmail()
  email: string;

  @Prop({ required: true, minlength: 8 })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
