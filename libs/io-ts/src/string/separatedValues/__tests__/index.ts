import * as E from 'fp-ts/Either'
import { separatedValues } from '..'

const decodingFixtures: [string, unknown, E.Either<unknown, unknown[]>][] = [
	[
		',',
		42,
		E.left([
			{
				message: 'The value "42" should be a string',
				value: 42,
			},
		]),
	],
	[',', '', E.right([])],
	[',', 'foo,bar,baz', E.right(['foo', 'bar', 'baz'])],
	[';', 'foo;bar;baz', E.right(['foo', 'bar', 'baz'])],
	[',', 'foo;bar;baz', E.right(['foo;bar;baz'])],
]

describe('separatedValues', () => {
	it.each(decodingFixtures)('decodes by %s the value "%s"', (separator, values, expected) => {
		expect(separatedValues(separator).decode(values)).toMatchObject(expected)
	})

	it('encodes correctly an array of values', () => {
		expect(separatedValues(',').encode(['1', '2', '3'])).toBe('1,2,3')
	})

	it('behaves correctly on its type guard', () => {
		expect(separatedValues(',').is(['1', '2', '3'])).toBe(true)
	})
})
