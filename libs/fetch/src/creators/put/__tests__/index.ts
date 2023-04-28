import { put } from '..'

const fakeFetch = jest.fn()

window.fetch = fakeFetch

describe('put', () => {
	it('creates a PUT request', () => {
		const endpoint = 'https://prontopro.it/api/fake'
		const response = new Response()

		fakeFetch.mockResolvedValueOnce(response)

		const doRequest = put(endpoint)

		return doRequest().then(() => {
			expect(fakeFetch).toHaveBeenCalledWith(
				endpoint,
				expect.objectContaining<RequestInit>({ cache: 'no-store', credentials: 'same-origin', method: 'PUT' }),
			)
		})
	})
})
