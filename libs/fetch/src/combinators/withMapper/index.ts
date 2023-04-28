import type { Err, Req } from '@contactlab/appy'
import { map, right } from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import { chain, fromEither } from 'fp-ts/ReaderTaskEither'

/**
 * Map the response data to another one.
 *
 * @category combinators
 * @since 0.7.0
 */
export function withMapper<A, B>(mapper: (data: A) => B) {
	return (req: Req<A>): Req<B> =>
		pipe(
			req,
			chain((resp) =>
				fromEither(
					pipe(
						right<Err, A>(resp.data),
						map(mapper),
						map((data) => ({ ...resp, data })),
					),
				),
			),
		)
}
