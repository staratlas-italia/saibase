import type * as t from 'io-ts'

export type Shape<Props extends t.Props> = {
	[Key in keyof Props]: t.TypeOf<Props[Key]>
}
