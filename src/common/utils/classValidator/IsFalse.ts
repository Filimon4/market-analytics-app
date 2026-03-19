import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsFalse(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isTrue',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return value === false;
        },
        defaultMessage() {
          return `${propertyName} must be false`;
        },
      },
    });
  };
}
