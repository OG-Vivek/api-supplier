import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { ConfigModules } from './config/config.module';
import { CommonModule } from './common/common.module';
import { SupplyModule } from './supply/supply.module';
import { MappingModule } from './mapping/mapping.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ResourcesModule } from './resources/resources.module';
import { JwtModule } from '@nestjs/jwt';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import type { RedisClientOptions } from 'redis';

@Module({
  imports: [
    DatabaseModule,
    ConfigModules,
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: '127.0.0.1',
      port: 6379,
      auth_pass: process.env.REDIS_AUTH_PASS,
      ttl: 10 * 60 * 1000 , // 10 mints
    }),
    
    SupplyModule,
    CommonModule,
    MappingModule,
    ResourcesModule,
    ConfigModule.forRoot(), 
    JwtModule.register({
      global: true,
      secret: process.env.JWT_KEY,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
