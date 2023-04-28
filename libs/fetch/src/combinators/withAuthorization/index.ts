import { withHeaders } from '@contactlab/appy/combinators/headers'

/**
 * Sets the `Authorization` header with the given API token on the `Req` init object and returns the updated `Req`.
 *
 * @category combinators
 */
export const withAuthorization = (apiToken: string) => withHeaders({ Authorization: apiToken })
