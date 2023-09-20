import { right } from 'fp-ts/Either'
import * as t from 'io-ts'
import { weakUnion } from '..'

describe('weakUnion', () => {
	it('returns default value if the codecs fails to decode the unknown value', () => {
		const codec = weakUnion([t.literal('flag-a'), t.literal(1), t.strict({ a: t.string })], 'unknown' as const)

		expect(codec.decode('flag-c')).toEqual(right('unknown'))
	})

	it('returns the literal value if a codec successes to decode the unknown value', () => {
		const codec = weakUnion([t.literal('flag-a'), t.literal(1), t.strict({ a: t.string })], 'unknown' as const)

		expect(codec.decode('flag-a')).toEqual(right('flag-a'))
	})

	it('encodes correctly a value known in the codec', () => {
		const codec = weakUnion([t.literal('flag-a'), t.literal(1), t.strict({ a: t.string })], 'unknown' as const)

		const encodedValue = codec.encode({ a: 'foo' })

		expect(encodedValue).toStrictEqual({ a: 'foo' })
	})
})
