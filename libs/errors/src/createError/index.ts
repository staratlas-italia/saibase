import * as E from 'fp-ts/Either';

export const createError =
  <T extends string>(type: T) =>
  (error: unknown) => ({
    error: E.toError(error),
    type,
  });
