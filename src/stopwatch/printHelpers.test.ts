import replaceTokens from './printHelpers';

describe('printHelpers replaceTokens', () => {
	it('replaces multiple occurrences of tokens', () => {
		const format = '${minutes}m ${minutes}m and ${seconds}s';
		const result = replaceTokens(
			format,
			{ hours: '01', minutes: '05', seconds: '09' },
			{ hours: '${hours}', minutes: '${minutes}', seconds: '${seconds}' },
		);
		expect(result).toBe('05m 05m and 09s');
	});

	it('returns empty string for empty format', () => {
		expect(
			replaceTokens('', { hours: '00', minutes: '00', seconds: '00' }, { hours: 'hh', minutes: 'mm', seconds: 'ss' }),
		).toBe('');
	});

	it('replaces hh/mm/ss tokens as well', () => {
		const fmt = 'hh:mm:ss';
		const result = replaceTokens(
			fmt,
			{ hours: '02', minutes: '03', seconds: '04' },
			{ hours: 'hh', minutes: 'mm', seconds: 'ss' },
		);
		expect(result).toBe('02:03:04');
	});
});
