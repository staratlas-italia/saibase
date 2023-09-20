import { isRight } from 'fp-ts/Either'
import * as t from 'io-ts'
import { optional } from '..'

describe('optional', () => {
	it('decodes correctly the expected string value', () => {
		const codec = optional(t.string)

		const decodedValue = codec.decode('42')

		expect(isRight(decodedValue)).toBe(true)
	})

	it('decodes correctly the expected undefined value', () => {
		const codec = optional(t.string)

		const decodedValue = codec.decode(undefined)

		expect(isRight(decodedValue)).toBe(true)
	})

	it('decodes incorrectly the unexpected value', () => {
		const codec = optional(t.string)

		const decodedValue = codec.decode(1)

		expect(isRight(decodedValue)).toBe(false)
	})
})
