import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsTrue(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isTrue',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return value === true;
        },
        defaultMessage() {
          return `${propertyName} must be true`;
        },
      },
    });
  };
}
