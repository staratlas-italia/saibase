import { normalizeReqInput, type Req, type ReqInput } from '@contactlab/appy'
import { pipe } from 'fp-ts/function'
import { local } from 'fp-ts/Reader'
import { mapSnd } from 'fp-ts/Tuple'

/**
 * Sets the provided `cache` on `Req` init object and returns the updated `Req`.
 *
 * @category combinators
 * @since 0.1.0
 */
export function withCache<A>(cache: RequestCache) {
	return (req: Req<A>) =>
		pipe(
			req,
			local(
				(input: ReqInput): ReqInput =>
					pipe(
						normalizeReqInput(input),
						mapSnd((init) => ({ cache, ...init })),
					),
			),
		)
}
