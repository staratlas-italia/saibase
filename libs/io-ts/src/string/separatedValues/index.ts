import { pipe } from 'fp-ts/function'
import { split } from 'fp-ts/string'
import { array, failures, string, Type } from 'io-ts'

export const separatedValues = (separator: string, name = `SeparatedValues`) =>
	new Type<string[], string, unknown>(
		name,
		(unknownValue): unknownValue is string[] => Array.isArray(unknownValue) && unknownValue.every(string.is),
		(maybeString, context) => {
			if (typeof maybeString !== 'string') {
				return failures([
					{ context, message: `The value "${String(maybeString)}" should be a string`, value: maybeString },
				])
			}

			return pipe(maybeString, split(separator), (values) => array(string).validate(values.filter(Boolean), context))
		},
		(values) => values.join(separator),
	)
