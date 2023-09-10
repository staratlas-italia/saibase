import * as t from 'io-ts'

export const notEmptyString = new t.Type<string, string, unknown>(
	'nonEmptyString',
	(u): u is string => typeof u === 'string' && u.trim().length > 0,
	(u, c) => {
		if (typeof u === 'string' && u.trim().length > 0) {
			return t.success(u)
		}

		return t.failure(u, c, 'This field cannot be empty')
	},
	t.identity,
)
