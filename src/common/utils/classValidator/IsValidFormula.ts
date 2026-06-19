import { buildMessage, ValidateBy, ValidationOptions } from 'class-validator';
import { parse } from 'mathjs';
import { buildFormulaExpression, FormulaPaletteItem, normalizeFormulaItems } from '@src/shared/formula/formula.helpers';

export const IS_VALID_FORMULA = 'isValidFormula';

export function isValidFormula(value: unknown): boolean {
  if (!Array.isArray(value)) {
    return false;
  }

  const formulaItems = value as FormulaPaletteItem[];
  const normalizedFormula = normalizeFormulaItems(formulaItems);

  if (normalizedFormula.length === 0) {
    return true;
  }

  const ufChannelMap = new Map<bigint, { value: string }>(
    normalizedFormula
      .filter((item) => item.fType === 'uf-channel')
      .map((item) => [BigInt(item.ufChannelId), { value: '1' }] as const),
  );

  const expression = buildFormulaExpression(normalizedFormula, ufChannelMap);

  if (!expression.trim()) {
    return false;
  }

  try {
    parse(expression);
    return true;
  } catch {
    return false;
  }
}

export function IsValidFormula(validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_VALID_FORMULA,
      validator: {
        validate: (value): boolean => isValidFormula(value),
        defaultMessage: buildMessage(
          (eachPrefix) => `${eachPrefix}$property must be a valid evaluable formula`,
          validationOptions,
        ),
      },
    },
    validationOptions,
  );
}
