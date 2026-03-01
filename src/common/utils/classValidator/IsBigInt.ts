
import { buildMessage, ValidateBy, ValidationOptions } from 'class-validator';
import matchesValidator from 'validator/lib/matches';

export const IS_BIGINT = 'isBigInt';

export function isBigInt(value: number | string): boolean {
    return (typeof value === 'number' || typeof value === 'string') && (matchesValidator(`${value}`, /^[0-9]+$/) || matchesValidator(`${value}`, /^[0-9]+n+$/));
}

export function IsBigInt(validationOptions?: ValidationOptions): PropertyDecorator {
    return ValidateBy(
        {
            name: IS_BIGINT,
            validator: {
                validate: (value, args): boolean => isBigInt(value),
                defaultMessage: buildMessage(
                    eachPrefix => eachPrefix + '$property must be a BigInt',
                    validationOptions
                ),
            },
        },
        validationOptions
    );
}
