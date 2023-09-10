import { isRight } from 'fp-ts/Either'
import { notEmptyString } from '..'

describe('notEmptyString', () => {
	it('decodes correctly the expected valued string', () => {
		const codec = notEmptyString

		const decodedValue = codec.decode('42')

		expect(isRight(decodedValue)).toBe(true)
	})

	it('fails to decode a different value respect to string', () => {
		const codec = notEmptyString

		const decodedValue = codec.decode(1)

		expect(isRight(decodedValue)).toBe(false)
	})

	it('fails to decode an empty string', () => {
		const codec = notEmptyString

		const decodedValue = codec.decode('')

		expect(isRight(decodedValue)).toBe(false)
	})
})
