import { del } from '..'

const fakeFetch = jest.fn()

window.fetch = fakeFetch

describe('del', () => {
	it('creates a DELETE request', () => {
		const endpoint = 'https://prontopro.it/api/fake'
		const response = new Response()

		fakeFetch.mockResolvedValueOnce(response)

		const doRequest = del(endpoint)

		return doRequest().then(() => {
			expect(fakeFetch).toHaveBeenCalledWith(
				endpoint,
				expect.objectContaining<RequestInit>({ cache: 'no-store', credentials: 'same-origin', method: 'DELETE' }),
			)
		})
	})
})
