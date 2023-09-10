import * as t from 'io-ts'

export const optional = <T extends t.Mixed>(codec: T) => t.union([codec, t.undefined], 'Optional' as const)
