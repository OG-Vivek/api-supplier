import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: any) => ({
        uri: process.env.mongoDb_url, 
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
