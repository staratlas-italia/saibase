import { get } from '@contactlab/appy';
import { left, right } from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { literal, strict } from 'io-ts';
import { withMapper } from '..';
import { withDecoder } from '../../withDecoder';

const fakeFetch = jest.fn();

window.fetch = fakeFetch;

const decoder = strict({
  address: literal('Via Garibaldi, 190'),
  company: literal('Saibase'),
});

describe('withMapper', () => {
  afterEach(() => {
    fakeFetch.mockRestore();
  });

  it('uses the provided io-ts decoder to validate the API response and a custom mapper to map the decoded response', () => {
    const data = { address: 'Via Garibaldi, 190', company: 'Saibase' };
    const endpoint = 'https://saibase.it/api/fake';
    const response = new Response(JSON.stringify(data));

    fakeFetch.mockResolvedValueOnce(response);

    const doRequest = pipe(
      get,
      withDecoder(decoder),
      withMapper((resp) => ({ ...resp, company: 'ProPronto' }))
    )(endpoint);

    return doRequest().then((result) => {
      expect(result).toEqual(
        right(
          expect.objectContaining({
            data: { ...data, company: 'ProPronto' },
            response,
          })
        )
      );
    });
  });

  it("fails with a Left<ResponseError> if the payload does not pass the decoding and doesn't map the response body", () => {
    const data = { company: 'Thumbtack' };
    const endpoint = 'https://dev.saibase.it/api/fake';
    const response = new Response(JSON.stringify(data));

    fakeFetch.mockResolvedValueOnce(response);

    const doRequest = pipe(
      get,
      withDecoder(decoder),
      withMapper((resp) => ({ ...resp, company: 'tackThumb' }))
    )(endpoint);

    return doRequest().then((result) => {
      expect(result).toEqual(
        left(expect.objectContaining({ type: 'ResponseError' }))
      );
    });
  });
});
