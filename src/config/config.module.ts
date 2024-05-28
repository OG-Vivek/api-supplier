import { Module } from '@nestjs/common';
import { ConfigServices } from './config.service';
import { ConfigController } from './config.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['production.env', 'staging.env', '.env'],
    }),
  ],
  providers: [ConfigServices],
  controllers: [ConfigController],
  exports: [ConfigServices],
})
export class ConfigModules {
  constructor() {}
}
