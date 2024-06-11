import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
    BadRequestException,
  } from '@nestjs/common';
  import { validate, ValidationError } from 'class-validator';
  import { plainToInstance } from 'class-transformer';
  
  @Injectable()
  export class notNullValidationPipe implements PipeTransform<any> {
    async transform(value: any, metadata: ArgumentMetadata) {
      const { metatype } = metadata;
      if (!metatype || !this.toValidate(metatype)) {
        return value;
      }
      const object = plainToInstance(metatype, value);
      const errors = await validate(object, { stopAtFirstError: true });
  
      if (errors.length > 0) {
        const firstErrors = this.getFirstErrors(errors);
        throw new BadRequestException(firstErrors);
      }
      return value;
    }
  
    private toValidate(metatype: Function): boolean {
      const types: Function[] = [String, Boolean, Number, Array, Object];
      return !types.includes(metatype);
    }
  
    private getFirstErrors(errors: ValidationError[]) {
      const result = {};
      for (const error of errors) {
        if (error.constraints) {
          result[error.property] = Object.values(error.constraints)[0];
        } else if (error.children && error.children.length > 0) {
          Object.assign(result, this.getFirstErrors(error.children));
        }
      }
      return result;
    }
  }
  