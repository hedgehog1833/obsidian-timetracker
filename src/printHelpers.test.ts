import {
	appendSuffix,
	applyTextColor,
	buildPrintValue,
	getCurrentTimeValues,
	loadFirstTextColor,
	replaceTokens,
	rgbToHex,
} from './printHelpers';

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

describe('buildPrintValue', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('uses custom printFormat when provided and applies color/suffix', () => {
		// given
		const settings: any = {
			printFormat: '${hours}:${minutes}:${seconds}',
			textColor: '#00ff00',
			lineBreakAfterInsert: false,
			trimLeadingZeros: true,
		};
		const container = document.createElement('div');

		const timeValues = { hours: '01', minutes: '02', seconds: '03' };
		jest.spyOn(require('./printHelpers'), 'getCurrentTimeValues').mockReturnValue(timeValues as any);
		const replaceSpy = jest.spyOn(require('./printHelpers'), 'replaceTokens').mockReturnValue('REPLACED');
		const colorSpy = jest.spyOn(require('./printHelpers'), 'applyTextColor').mockReturnValue('COLORED');
		const suffixSpy = jest.spyOn(require('./printHelpers'), 'appendSuffix').mockReturnValue('FINAL');

		// when
		const result = buildPrintValue(settings, 1234, container);

		// then
		expect(require('./printHelpers').getCurrentTimeValues).toHaveBeenCalledWith(1234, true);
		expect(replaceSpy).toHaveBeenCalledWith(settings.printFormat, timeValues, {
			hours: '${hours}',
			minutes: '${minutes}',
			seconds: '${seconds}',
		});
		expect(colorSpy).toHaveBeenCalledWith('REPLACED', settings.textColor, container);
		expect(suffixSpy).toHaveBeenCalledWith('COLORED', settings.lineBreakAfterInsert);
		expect(result).toBe('FINAL');
	});

	it('uses default format when printFormat is empty', () => {
		// given
		const settings: any = {
			printFormat: '',
			textColor: '#00ff00',
			lineBreakAfterInsert: true,
			trimLeadingZeros: false,
		};
		const container = document.createElement('div');

		const timeValues = { hours: '12', minutes: '34', seconds: '56' };
		jest.spyOn(require('./printHelpers'), 'getCurrentTimeValues').mockReturnValue(timeValues as any);
		const replaceSpy = jest.spyOn(require('./printHelpers'), 'replaceTokens').mockReturnValue('REPLACED_DEFAULT');
		jest.spyOn(require('./printHelpers'), 'applyTextColor').mockReturnValue('COLORED_DEFAULT');
		jest.spyOn(require('./printHelpers'), 'appendSuffix').mockReturnValue('FINAL_DEFAULT');

		// when
		const result = buildPrintValue(settings, 9999, container);

		// then
		expect(replaceSpy).toHaveBeenCalledWith(expect.any(String), timeValues, {
			hours: 'hh',
			minutes: 'mm',
			seconds: 'ss',
		});
		expect(result).toBe('FINAL_DEFAULT');
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

	it('appendSuffix adds zero-width space if lineBreakAfterInsert is false', () => {
		// when
		const withoutBreak = appendSuffix('value', false);

		// then
		expect(withoutBreak.endsWith('\u200B ')).toBe(true);
	});

	it('appendSuffix adds newline if lineBreakAfterInsert is true', () => {
		// when
		const withBreak = appendSuffix('value', true);

		// then
		expect(withBreak.endsWith('\n')).toBe(true);
	});
});
