import { get } from '@contactlab/appy'
import { left, right } from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import { literal, strict } from 'io-ts'
import { withDecoder } from '..'

const fakeFetch = jest.fn()

window.fetch = fakeFetch

const decoder = strict({
	company: literal('ProntoPro'),
})

describe('withDecoder', () => {
	afterEach(() => {
		fakeFetch.mockRestore()
	})

	it('uses the provided io-ts decoder to validate the API response', () => {
		const data = { company: 'ProntoPro' }
		const endpoint = 'https://staging.prontopro.it/api/fake'
		const response = new Response(JSON.stringify(data))

		fakeFetch.mockResolvedValueOnce(response)

		const doRequest = pipe(get, withDecoder(decoder))(endpoint)

		return doRequest().then((result) => {
			expect(result).toEqual(right({ data, response }))
		})
	})

	it('fails with a Left<ResponseError> if the payload does not pass the decoding', () => {
		const data = { company: 'Thumbtack' }
		const endpoint = 'https://staging.prontopro.it/api/fake'
		const response = new Response(JSON.stringify(data))

		fakeFetch.mockResolvedValueOnce(response)

		const doRequest = pipe(get, withDecoder(decoder))(endpoint)

		return doRequest().then((result) => {
			expect(result).toEqual(left(expect.objectContaining({ type: 'ResponseError' })))
		})
	})
})
