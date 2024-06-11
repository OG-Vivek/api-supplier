import { IsNotEmpty } from 'class-validator';
import { IsStrictString } from 'src/customValidators/is-strict-string.validator'
 
export class GetQuestionsDto {
    @IsNotEmpty()
    @IsStrictString({ message: 'countryKey must be a string' })
    readonly countryKey: string;
  
    @IsNotEmpty()
    @IsStrictString({ message: 'language must be a string' })
    readonly language: string;
  }