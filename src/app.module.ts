import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { ConfigModules } from './config/config.module';
import { CommonModule } from './common/common.module';
import { SupplyModule } from './supply/supply.module';
import { MappingModule } from './mapping/mapping.module';
import { ResourcesModule } from './resources/resources.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModules,
    SupplyModule,
    CommonModule,
    MappingModule,
    ResourcesModule,
    ConfigModule.forRoot(), // Register the dynamic module
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
