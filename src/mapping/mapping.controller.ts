import { Controller, Get, Param, UsePipes } from '@nestjs/common';
import { MappingService } from './mapping.service';
import { MetadataFieldsValidationPipe } from 'src/pipes/metaFields';

@Controller('mapping')
export class MappingController {
  constructor(private readonly _mappingService: MappingService) {}

  @UsePipes(MetadataFieldsValidationPipe)
  @Get('metadata/:fields')
  getMetadataFields(@Param('fields') fields: string[]) {
    console.log(fields)
    // return this._mappingService.getMetadataFields();
    return this._mappingService.getMetadataFields(fields);
  }
}
