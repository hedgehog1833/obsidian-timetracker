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

	it('showHours, showMinutes returns "hh:mm"', () => {
		// given
		settings.showSeconds = false;

		// when
		const format = getFormat(settings, false);

		// then
		expect(format).toBe('hh:mm');
	});

	it('showHours, showSeconds returns "hh:ss"', () => {
		// given
		settings.showMinutes = false;

		// when
		const format = getFormat(settings, false);

		// then
		expect(format).toBe('hh:ss');
	});

	it('showHours returns "hh"', () => {
		// given
		settings.showMinutes = false;
		settings.showSeconds = false;

		// when
		const format = getFormat(settings, false);

		// then
		expect(format).toBe('hh');
	});

	it('showMinutes, showSeconds returns "mm:ss"', () => {
		// given
		settings.showHours = false;

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
