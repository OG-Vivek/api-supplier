import { Controller } from '@nestjs/common';
import { DataBaseService } from './database.service';

@Controller()
export class DataBaseController {
  constructor(private readonly dbService: DataBaseService) {}

}
