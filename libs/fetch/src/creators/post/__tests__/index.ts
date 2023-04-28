import { post } from '..'

const fakeFetch = jest.fn()

window.fetch = fakeFetch

describe('post', () => {
	it('creates a POST request', () => {
		const endpoint = 'https://prontopro.it/api/fake'
		const response = new Response()

		fakeFetch.mockResolvedValueOnce(response)

		const doRequest = post(endpoint)

		return doRequest().then(() => {
			expect(fakeFetch).toHaveBeenCalledWith(
				endpoint,
				expect.objectContaining<RequestInit>({ cache: 'no-store', credentials: 'same-origin', method: 'POST' }),
			)
		})
	})
})
