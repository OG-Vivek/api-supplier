import { Module } from '@nestjs/common';
import { SupplyService } from './supply.service';
import { SupplyController } from './supply.controller';

@Module({
  imports: [],
  controllers: [SupplyController],
  providers: [SupplyService],
  exports: [],
})
export class SupplyModule {}
