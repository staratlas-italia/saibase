import { request } from '@contactlab/appy'
import { pipe } from 'fp-ts/function'
import { withSignal } from '..'

const fakeFetch = jest.fn()

window.fetch = fakeFetch

describe('withSignal', () => {
	afterEach(() => {
		fakeFetch.mockRestore()
	})

	it('sets the provided signal configuration to the fetch request init', () => {
		const endpoint = 'https://staging.prontopro.it/api/fake'
		const response = new Response()
		const { signal } = new AbortController()

		fakeFetch.mockResolvedValueOnce(response)

		const doRequest = pipe(request, withSignal(signal))(endpoint)

		return doRequest().then(() => {
			expect(fakeFetch).toHaveBeenCalledWith(endpoint, expect.objectContaining({ signal }))
		})
	})

	it('applies the last provided signal configuration if set more than once', () => {
		const endpoint = 'https://prontopro.it/api/fake'
		const response = new Response()
		const { signal: signalToDiscard } = new AbortController()
		const { signal: signalToUse } = new AbortController()

		fakeFetch.mockResolvedValueOnce(response)

		const doRequest = pipe(request, withSignal(signalToDiscard), withSignal(signalToUse))(endpoint)

		return doRequest().then(() => {
			expect(fakeFetch).toHaveBeenCalledWith(endpoint, expect.objectContaining({ signal: signalToUse }))
		})
	})
})
