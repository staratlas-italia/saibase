import type { Req, ReqInput } from '@contactlab/appy';
import { normalizeReqInput } from '@contactlab/appy';
import { pipe } from 'fp-ts/function';
import { local } from 'fp-ts/Reader';
import { mapSnd } from 'fp-ts/Tuple';

/**
 * Sets the provided `signal` on `Req` init object and returns the updated `Req`.
 *
 * @category combinators
 * @since 0.1.0
 */
export function withSignal<A>(signal: Readonly<AbortSignal>) {
  return (req: Req<A>) =>
    pipe(
      req,
      local(
        (input: ReqInput): ReqInput =>
          pipe(
            normalizeReqInput(input),
            mapSnd((init) => ({ signal, ...init }))
          )
      )
    );
}
