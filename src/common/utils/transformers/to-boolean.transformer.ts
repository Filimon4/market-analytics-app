import { TransformFnParams } from 'class-transformer';

export const toBoolean = ({ value }: TransformFnParams): boolean => {
  if (!value) return false;
  if (value === true || value === 'true' || value === '1') return true;

  return false;
};

export const toOptionalBoolean = ({ value }: TransformFnParams): boolean | undefined => {
  if (value === undefined || value === null || value === '') return undefined;
  if (value === true || value === 'true' || value === '1') return true;

  return false;
};
