import { applyTextColor, getCurrentTimeValues, loadFirstTextColor, replaceTokens, rgbToHex } from './printHelpers';

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

describe('printHelpers other utilities', () => {
	it('loadFirstTextColor sets default on empty string', () => {
		const settings: any = { textColor: '' };
		const changed = loadFirstTextColor(settings);
		expect(changed).toBe(true);
		expect(settings.textColor).toBe('#dadada');
	});

	it('applyTextColor wraps when different than container color', () => {
		const container = document.createElement('div');
		container.style.color = 'rgb(1,2,3)';
		const wrapped = applyTextColor('value', '#00ff00', container);
		expect(wrapped).toContain('color:#00ff00');
	});

	it('rgbToHex converts rgb string to hex', () => {
		expect(rgbToHex('rgb(10, 20, 30)')).toBe('#0a141e');
	});

	it('rgbToHex fallback for empty', () => {
		expect(rgbToHex('')).toBe('#dadada');
	});

	it('getCurrentTimeValues returns trimmed values when requested', () => {
		const values = getCurrentTimeValues(1000 * 60 * 61, true); // 1h1m0s
		expect(values.hours).toBe('1');
		expect(values.minutes).toBe('1');
		expect(values.seconds).toBe('0');
	});
});
