import { patch } from '..'

const fakeFetch = jest.fn()

window.fetch = fakeFetch

describe('patch', () => {
	it('creates a PATCH request', () => {
		const endpoint = 'https://prontopro.it/api/fake'
		const response = new Response()

		fakeFetch.mockResolvedValueOnce(response)

		const doRequest = patch(endpoint)

		return doRequest().then(() => {
			expect(fakeFetch).toHaveBeenCalledWith(
				endpoint,
				expect.objectContaining<RequestInit>({ cache: 'no-store', credentials: 'same-origin', method: 'PATCH' }),
			)
		})
	})
})
