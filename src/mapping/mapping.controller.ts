import { Controller, Get, Param, Res, UseGuards, UsePipes } from '@nestjs/common';
import { MappingService } from './mapping.service';
import { MetadataFieldsValidationPipe } from 'src/pipes/metaFields';
import { Response } from 'express';
import { verifySupplierGuard } from 'src/guards/verifySupplier.guard';

// @UseGuards(verifySupplierGuard)
@Controller('mapping')
export class MappingController {
  constructor(private readonly _mappingService: MappingService) {}

  @UsePipes(MetadataFieldsValidationPipe)
  @Get('metadata/:fields')
  async getMetadataFields(@Param('fields') fields: string[] ,@Res() res :Response) {
    try {
      let result = await this._mappingService.getMetadataFields(fields);
      if(!result)
        return res.status(404).json({ apiStatus: 'Error', error: 'No data found' });
      return res.status(200).json({ apiStatus: 'Success', result });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ apiStatus: 'Error', error: 'Something went wrong' });
    }
  }
}
