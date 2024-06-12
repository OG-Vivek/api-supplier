import { Controller, Get, HttpException, HttpStatus, Param, UseInterceptors, UsePipes } from '@nestjs/common';
import { MappingService } from './mapping.service';
import { MetadataFieldsValidationPipe } from 'src/pipes/metaFields';
import { verifySupplierGuard } from 'src/guards/verifySupplier.guard';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';

// @UseGuards(verifySupplierGuard)
@Controller('mapping')
export class MappingController {
  constructor(private readonly _mappingService: MappingService) {}
  
  @UseInterceptors(CacheInterceptor)
  @UsePipes(MetadataFieldsValidationPipe)
  @Get('metadata/:fields')
  async getMetadataFields(@Param('fields') fields: string[] ) {
    try {
      let result = await this._mappingService.getMetadataFields(fields);
      return { apiStatus: 'Success', result }
    } catch (error) {
      console.error(error);
     throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
