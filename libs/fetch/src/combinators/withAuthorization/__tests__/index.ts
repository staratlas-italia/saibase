import { request } from '@contactlab/appy'
import { pipe } from 'fp-ts/function'
import mockedFetch from 'jest-fetch-mock'
import { withAuthorization } from '..'

afterEach(() => mockedFetch.resetMocks())

describe('withAuthorization', () => {
	it('sets the Authorization header to the provided API token on the request', async () => {
		const endpoint = 'https://example.com/api/fake'
		const apiToken = 'test-token'

		mockedFetch.mockResponseOnce('{}')

		const doRequest = pipe(request, withAuthorization(apiToken))(endpoint)

		await doRequest()

		expect(mockedFetch).toHaveBeenCalledWith(endpoint, {
			headers: {
				Authorization: apiToken,
			},
		})
	})

	it('applies the last provided API token if set more than once', async () => {
		const endpoint = 'https://example.com/api/fake'
		const apiTokenToDiscard = 'test-token-to-discard'
		const apiTokenToUse = 'test-token'

		mockedFetch.mockResponseOnce('{}')

		const doRequest = pipe(request, withAuthorization(apiTokenToDiscard), withAuthorization(apiTokenToUse))(endpoint)

		await doRequest()

		expect(mockedFetch).toHaveBeenCalledWith(endpoint, {
			headers: {
				Authorization: apiTokenToUse,
			},
		})
	})
})
