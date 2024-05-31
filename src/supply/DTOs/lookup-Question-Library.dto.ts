import { IsNotEmpty } from 'class-validator';
import { IsStrictString } from 'src/customValidators/is-strict-string.validator'
 
export class GetQuestionsDto {
    @IsNotEmpty()
    @IsStrictString({ message: 'countryKey must be a string and not a number' })
    readonly countryKey: string;
  
    @IsNotEmpty()
    @IsStrictString({ message: 'language must be a string and not a number' })
    readonly language: string;
  }