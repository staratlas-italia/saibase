import { request } from '@contactlab/appy'
import { pipe } from 'fp-ts/function'
import mockedFetch from 'jest-fetch-mock'
import { withOptionalSignal } from '..'

afterEach(() => mockedFetch.resetMocks())

describe('withOptionalSignal', () => {
	it('sets the provided signal configuration to the fetch request init', async () => {
		const endpoint = 'https://example.com/api/fake'
		const { signal } = new AbortController()

		mockedFetch.mockResponseOnce('{}')

		const doRequest = pipe(request, withOptionalSignal(signal))(endpoint)

		await doRequest()

		expect(mockedFetch).toHaveBeenCalledWith(endpoint, { signal })
	})

	it('applies the last provided signal configuration if set more than once', async () => {
		const endpoint = 'https://example.com/api/fake'
		const { signal: signalToDiscard } = new AbortController()
		const { signal: signalToUse } = new AbortController()

		mockedFetch.mockResponseOnce('{}')

		const doRequest = pipe(request, withOptionalSignal(signalToDiscard), withOptionalSignal(signalToUse))(endpoint)

		await doRequest()

		expect(mockedFetch).toHaveBeenCalledWith(endpoint, { signal: signalToUse })
	})

	it('does nothing when no signal is provided', async () => {
		const endpoint = 'https://example.com/api/fake'

		mockedFetch.mockResponseOnce('{}')

		const doRequest = pipe(request, withOptionalSignal())(endpoint)

		await doRequest()

		expect(mockedFetch).toHaveBeenCalledWith(endpoint, {})
	})
})
