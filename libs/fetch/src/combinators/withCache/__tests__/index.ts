import { request } from '@contactlab/appy';
import { pipe } from 'fp-ts/function';
import { withCache } from '..';

const fakeFetch = jest.fn();

window.fetch = fakeFetch;

describe('withCache', () => {
  afterEach(() => {
    fakeFetch.mockRestore();
  });

  it('Sets the provided cache configuration to the fetch request init', () => {
    const endpoint = 'https://dev.saibase.it/api/fake';
    const response = new Response();

    fakeFetch.mockResolvedValueOnce(response);

    const doRequest = pipe(request, withCache('no-cache'))(endpoint);

    return doRequest().then(() => {
      expect(fakeFetch).toHaveBeenCalledWith(
        endpoint,
        expect.objectContaining({ cache: 'no-cache' })
      );
    });
  });

  it('Applies the last provided cache configuration if set more than once', () => {
    const endpoint = 'https://dev.saibase.it/api/fake';
    const response = new Response();

    fakeFetch.mockResolvedValueOnce(response);

    const doRequest = pipe(
      request,
      withCache('no-cache'),
      withCache('default')
    )(endpoint);

    return doRequest().then(() => {
      expect(fakeFetch).toHaveBeenCalledWith(
        endpoint,
        expect.objectContaining({ cache: 'default' })
      );
    });
  });
});
