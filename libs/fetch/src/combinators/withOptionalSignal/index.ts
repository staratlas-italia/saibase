import { identity } from 'fp-ts/function'
import { withSignal } from '../withSignal'

/**
 * Sets the provided optional `signal` on `Req` init object and returns the updated `Req`.
 *
 * @category combinators
 */
export const withOptionalSignal = <A>(signal?: AbortSignal) => (signal ? withSignal<A>(signal) : identity)
