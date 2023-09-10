import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import type { Mixed, OutputOf, TypeOf } from 'io-ts'
import { identity, success, UnionType } from 'io-ts'

export const weakUnion = <CS extends [Mixed, ...Mixed[]], D>(codecs: CS, defaultValue: D) =>
	new UnionType<CS, TypeOf<CS[number]> | D, OutputOf<CS[number]> | undefined>(
		'WeakUnion',
		(u): u is TypeOf<CS[number]> | D => !!u,
		(u) =>
			pipe(
				codecs.map((codec) => codec.decode(u)),
				(decodedValues) => {
					const rightValue = decodedValues.find(E.isRight)

					return rightValue ? O.some(rightValue) : O.none
				},
				O.fold(
					() => success(defaultValue),
					(s) => s,
				),
			),
		(a) =>
			pipe(
				codecs.find((codec) => codec.is(a)),
				(codec) => (codec ? codec.encode : identity),
				(encoder: (a: D | TypeOf<CS[number]>) => unknown) => encoder(a),
			),
		codecs,
	)
