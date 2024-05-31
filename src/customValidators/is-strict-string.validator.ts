import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, registerDecorator, ValidationOptions  } from 'class-validator';


@ValidatorConstraint({ name: 'isStrictString', async: false })
class IsStrictStringConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    return typeof value === 'string' && isNaN(Number(value));
  }

  defaultMessage(args: ValidationArguments) {
    return 'Value ($value) must be a valid string and not a number';
  }
}

export function IsStrictString(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsStrictStringConstraint,
    });
  };
}

