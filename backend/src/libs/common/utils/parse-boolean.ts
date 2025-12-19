export function parseBoolean(value: string | undefined | null): boolean {
	if (value === undefined || value === null) {
		throw new Error('Boolean env value is missing')
	}

	switch (value.trim().toLowerCase()) {
		case 'true':
		case '1':
		case 'yes':
		case 'y':
			return true

		case 'false':
		case '0':
		case 'no':
		case 'n':
			return false

		default:
			throw new Error(`Invalid boolean env value: "${value}"`)
	}
}
