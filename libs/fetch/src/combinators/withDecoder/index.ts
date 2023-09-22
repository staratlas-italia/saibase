import type { Req } from '@contactlab/appy';
import * as D from '@contactlab/appy/combinators/decoder';
import type { Decoder } from 'io-ts';
import { formatValidationErrors } from 'io-ts-reporters';

function fromIoTs<A>(d: Decoder<unknown, A>): D.Decoder<A> {
  return D.toDecoder(
    d.decode,
    (e) => new Error(formatValidationErrors(e).join('\n'))
  );
}

/**
 * Applies `Decoder<B>` to the `Resp<A>` of a `Req` converting it to a `Resp<B>`.
 *
 * It returns a `Left<ResponseError>` in case the decoding fails.
 *
 * @category combinators
 * @since 0.1.0
 */
export function withDecoder<A, B>(decoder: Decoder<unknown, B>) {
  return (req: Req<A>): Req<B> => D.withDecoder<B>(fromIoTs(decoder))(req);
}
