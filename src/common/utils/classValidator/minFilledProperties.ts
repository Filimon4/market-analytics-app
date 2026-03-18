import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'MinFilledProperties', async: false })
export class MinFilledPropertiesConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const minCount = args.constraints[0] as number;
    const object = args.object as Record<string, any>;

    const filledCount = Object.entries(object).filter(([key, val]) => {
      return val !== undefined && val !== null;
    }).length;

    return filledCount >= minCount;
  }

  defaultMessage(args: ValidationArguments) {
    const min = args.constraints[0];
    return `At least ${min} properties must be provided (cannot be null/undefined).`;
  }
}

export function MinFilledProperties(minCount: number, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [minCount],
      validator: MinFilledPropertiesConstraint,
    });
  };
}
