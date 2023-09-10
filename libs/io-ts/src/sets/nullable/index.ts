import * as t from 'io-ts'

export const nullable = <T extends t.Mixed>(codec: T) => t.union([codec, t.null])
