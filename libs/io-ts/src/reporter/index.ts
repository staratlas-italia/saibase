import type { Left, Right } from 'fp-ts/Either';
import { fold } from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import type { ValidationError } from 'io-ts';

const formatError = (error: ValidationError) => {
  const path = error.context
    .map((context) => context.key)
    .filter((key) => key)
    .join('.');

  const errorContext = error.context[error.context.length - 1];
  const expectedType = errorContext ? errorContext.type.name : '';

  const atPath = path ? ` at path ${path}` : '';

  return `Expecting ${expectedType}${atPath} but got ${JSON.stringify(
    error.value
  )} instead.`;
};

export const reporter = <V extends ValidationError>(
  validation: Left<V[]> | Right<any>
) =>
  pipe(
    validation,
    fold(
      (errors) => errors.map(formatError).join('\n'),
      () => undefined
    )
  );
