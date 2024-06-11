import { IsNotEmpty, ValidateIf} from 'class-validator';
import { IsStrictString } from 'src/customValidators/is-strict-string.validator';
import { notNullValidationPipe } from 'src/customValidators/notNull.Validators';
 
export class GetAnswerDto {

    readonly questionKey: string;

    @IsNotEmpty()
    @IsStrictString({ message: 'country must be a stringS' })
    readonly country: string;

    @IsNotEmpty()
    @IsStrictString({ message: 'language must be a string' })
    readonly language: string;
  }