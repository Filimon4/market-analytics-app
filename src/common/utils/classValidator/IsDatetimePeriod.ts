import { buildMessage, ValidateBy, ValidationOptions } from 'class-validator';
import isISO8601Validator from 'validator/lib/isISO8601';
import { ITableColumnFilterDatetimePeriod } from 'src/common/interfaces/itable.interface';

export const IS_DATETIME_PERIOD = 'isDatetimePeriod';

export function isDatetimePeriod(value: unknown): value is ITableColumnFilterDatetimePeriod {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const period = value as Record<string, unknown>;

  if (typeof period.from !== 'string' || typeof period.to !== 'string') {
    return false;
  }

  if (!isISO8601Validator(period.from) || !isISO8601Validator(period.to)) {
    return false;
  }

  const fromDate = new Date(period.from);
  const toDate = new Date(period.to);

  if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) {
    return false;
  }

  return fromDate.getTime() <= toDate.getTime();
}

export function IsDatetimePeriod(validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_DATETIME_PERIOD,
      validator: {
        validate: (value): boolean => isDatetimePeriod(value),
        defaultMessage: buildMessage(
          (eachPrefix) =>
            eachPrefix +
            '$property must be a valid datetime period object with ISO dates: { from: string, to: string } and from <= to',
          validationOptions,
        ),
      },
    },
    validationOptions,
  );
}
