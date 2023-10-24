import { createError } from '..';

describe('createError', () => {
  it('returns an object with a type and an error if an error message is provided', () => {
    const { type, error } = createError('ErrorType')('Error Message');

    expect(type).toBe('ErrorType');
    expect(error.message).toBe('Error Message');
  });

  it('returns an object with a type and an error if an error is provided', () => {
    const { type, error } = createError('AnotherErrorType')(
      new Error('Oops, something went wrong')
    );

    expect(type).toBe('AnotherErrorType');
    expect(error.message).toBe('Oops, something went wrong');
  });
});
