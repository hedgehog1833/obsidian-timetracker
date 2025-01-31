import { TimetrackerSettings } from '../main';
import getFormat, { COMPLETE_TIME_FORMAT } from './formatSettings';

describe('formatSettings', () => {
	let settings: TimetrackerSettings;

	beforeEach(() => {
		settings = {
			showHours: true,
			showMinutes: true,
			showSeconds: true,
			trimLeadingZeros: true,
		} as TimetrackerSettings;
	});

	it('complete flag returns complete time format', () => {
		// when
		const format = getFormat(settings, true);

		// then
		expect(format).toBe(COMPLETE_TIME_FORMAT);
	});

	it('showHours, showMinutes, showSeconds returns complete time format', () => {
		// when
		const format = getFormat(settings, false);

		// then
		expect(format).toBe(COMPLETE_TIME_FORMAT);
	});

	it('showHours, showMinutes returns "HH:mm"', () => {
		// given
		settings.showSeconds = false;

		// when
		const format = getFormat(settings, false);

		// then
		expect(format).toBe('HH:mm');
	});

	it('showHours, showSeconds returns "HH:ss"', () => {
		// given
		settings.showMinutes = false;

		// when
		const format = getFormat(settings, false);

		// then
		expect(format).toBe('HH:ss');
	});

	it('showHours returns "HH"', () => {
		// given
		settings.showMinutes = false;
		settings.showSeconds = false;

		// when
		const format = getFormat(settings, false);

		// then
		expect(format).toBe('HH');
	});

	it('showMinutes, showSeconds returns "mm:ss"', () => {
		// given
		settings.showMinutes = false;

		// when
		const format = getFormat(settings, false);

		// then
		expect(format).toBe('mm:ss');
	});

	it('showHours returns "mm"', () => {
		// given
		settings.showHours = false;
		settings.showSeconds = false;

		// when
		const format = getFormat(settings, false);

		// then
		expect(format).toBe('mm');
	});

	it('showHours returns "ss"', () => {
		// given
		settings.showHours = false;
		settings.showMinutes = false;

		// when
		const format = getFormat(settings, false);

		// then
		expect(format).toBe('ss');
	});
});
