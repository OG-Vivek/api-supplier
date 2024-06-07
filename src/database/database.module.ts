import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import { DataBaseService } from './database.service';
import { MongoClient } from 'mongodb';
import { MongoRepository } from './mongo.repository';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({ //TODO = We have to remove this and use providers instead
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: process.env.mongoDb_url,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [ DataBaseService,MongoRepository, {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (): Promise<MongoClient> => {
      try {
        var mongoUrl =  process.env.mongoDb_url;
          if(process.env.MONGO_URL){
            mongoUrl = process.env.MONGO_URL;
          }
          console.log(`mongoDB connected at ${mongoUrl}`);
        const client = await MongoClient.connect(mongoUrl)
        return client;
      } catch (e) {
        throw e;
      }
    }
  },],
  exports: [MongooseModule,DataBaseService,MongoRepository],
})
export class DatabaseModule {}
