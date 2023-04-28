import * as appy from '@contactlab/appy'
import { withHeaders } from '@contactlab/appy/combinators/headers'
import { pipe } from 'fp-ts/function'
import { withCache } from '../../combinators/withCache'
import { withCredentials } from '../../combinators/withCredentials'
import { defaultHeaders } from '../../constants/defaultHeaders'

/**
 * Makes a request with the `method` set to `PUT`, the `cache` set to `no-store`, the `credentials` set to `same-origin`
 * and with the default headers applied.
 *
 * @category creators
 * @since 0.1.0
 */
export const put = pipe(appy.put, withCache('no-store'), withCredentials('same-origin'), withHeaders(defaultHeaders))
