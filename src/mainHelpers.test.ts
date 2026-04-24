import { migrateFormat, rgbToHex } from './mainHelpers';

describe('mainHelpers', () => {
	it('migrateFormat moves flags and clears format', () => {
		const settings: any = { format: 'HMS', interval: 5 };
		const changed = migrateFormat(settings);
		expect(changed).toBe(true);
		expect(settings.format).toBeNull();
		expect(settings.interval).toBeNull();
		expect(settings.showHours).toBe(true);
		expect(settings.showMinutes).toBe(true);
		expect(settings.showSeconds).toBe(true);
	});

	it('migrateFormat returns false when no format', () => {
		const settings: any = {};
		expect(migrateFormat(settings)).toBe(false);
	});

	it('rgbToHex converts rgb string to hex', () => {
		expect(rgbToHex('rgb(10, 20, 30)')).toBe('#0a141e');
	});

	it('rgbToHex fallback for empty', () => {
		expect(rgbToHex('')).toBe('#dadada');
	});

	it('loadFirstTextColor sets default on empty string', () => {
		const settings: any = { textColor: '' };
		const changed = (require('./mainHelpers') as any).loadFirstTextColor(settings);
		expect(changed).toBe(true);
		expect(settings.textColor).toBe('#dadada');
	});

	it('getCurrentTimeValues returns trimmed values when requested', () => {
		const helpers = require('./mainHelpers') as any;
		const values = helpers.getCurrentTimeValues(1000 * 60 * 61, true); // 1h1m0s
		expect(values.hours).toBe('1');
		expect(values.minutes).toBe('1');
		expect(values.seconds).toBe('0');
	});
});
