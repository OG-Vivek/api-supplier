import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class MetadataFieldsValidationPipe implements PipeTransform {
  private readonly allowedFields = [
    'country',
    'category',
    'language',
    'surveyStatus',
    'deviceType',
    'groupType',
    'dma mapping',
    'jobType',
    'questionType ',
  ];

  transform(value: string, metadata: ArgumentMetadata) {
    const fieldsArray = value.split(','); 
    for (const field of fieldsArray) {
      if (!this.allowedFields.includes(field.trim())) {
        throw new BadRequestException(`Invalid field: ${field}`);
      }
    }
    return fieldsArray;
  }
}
