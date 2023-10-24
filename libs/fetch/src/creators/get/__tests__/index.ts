import { get } from '..';

const fakeFetch = jest.fn();

window.fetch = fakeFetch;

describe('get', () => {
  it('creates a GET request', () => {
    const endpoint = 'https://saibase.it/api/fake';

    const response = new Response();

    fakeFetch.mockResolvedValueOnce(response);

    const doRequest = get(endpoint);

    return doRequest().then(() => {
      expect(fakeFetch).toHaveBeenCalledWith(
        endpoint,
        expect.objectContaining<RequestInit>({
          cache: 'no-store',
          credentials: 'same-origin',
          method: 'GET',
        })
      );
    });
  });
});
