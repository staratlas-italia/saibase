import { isRight } from 'fp-ts/Either'
import * as t from 'io-ts'
import { nullable } from '..'

describe('nullable', () => {
	it('decodes correctly the expected string value', () => {
		const codec = nullable(t.string)

		const decodedValue = codec.decode('42')

		expect(isRight(decodedValue)).toBe(true)
	})

	it('decodes correctly the expected null value', () => {
		const codec = nullable(t.string)

		const decodedValue = codec.decode(null)

		expect(isRight(decodedValue)).toBe(true)
	})

	it('decodes incorrectly the unexpected value', () => {
		const codec = nullable(t.string)

		const decodedValue = codec.decode(1)

		expect(isRight(decodedValue)).toBe(false)
	})
})
