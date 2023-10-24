import { request } from '@contactlab/appy';
import { pipe } from 'fp-ts/function';
import { withCredentials } from '..';

const fakeFetch = jest.fn();

window.fetch = fakeFetch;

describe('withCredentials', () => {
  afterEach(() => {
    fakeFetch.mockRestore();
  });

  it('Sets the provided credentials configuration to the fetch request init', () => {
    const endpoint = 'https://dev.saibase.it/api/fake';
    const response = new Response();

    fakeFetch.mockResolvedValueOnce(response);

    const doRequest = pipe(request, withCredentials('same-origin'))(endpoint);

    return doRequest().then(() => {
      expect(fakeFetch).toHaveBeenCalledWith(
        endpoint,
        expect.objectContaining({ credentials: 'same-origin' })
      );
    });
  });

  it('Applies the last provided credentials configuration if set more than once', () => {
    const endpoint = 'https://dev.saibase.it/api/fake';
    const response = new Response();

    fakeFetch.mockResolvedValueOnce(response);

    const doRequest = pipe(
      request,
      withCredentials('same-origin'),
      withCredentials('omit')
    )(endpoint);

    return doRequest().then(() => {
      expect(fakeFetch).toHaveBeenCalledWith(
        endpoint,
        expect.objectContaining({ credentials: 'omit' })
      );
    });
  });
});
