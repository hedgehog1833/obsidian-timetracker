import { TimetrackerSettings } from '../main';
import getFormat, { COMPLETE_TIME_FORMAT } from './formatSettings';

describe('formatSettings', () => {
	let settings: TimetrackerSettings;

	beforeEach(() => {
		settings = {
			showHours: true,
			showMinutes: true,
			showSeconds: true,
			trimLeadingZeros: false,
		} as TimetrackerSettings;
	});

	it('complete flag returns complete time format', () => {
		// when
		const format = getFormat(settings, true);

		// then
		expect(format).toBe(COMPLETE_TIME_FORMAT);
	});

	it('complete flag returns complete time format with trimming', () => {
		// given
		settings.trimLeadingZeros = true;

		// when
		const format = getFormat(settings, true);

		// then
		expect(format).toBe('h:m:s');
	});

	it('showHours, showMinutes, showSeconds returns complete time format', () => {
		// when
		const format = getFormat(settings, false);

		// then
		expect(format).toBe(COMPLETE_TIME_FORMAT);
	});

	it('showHours, showMinutes, showSeconds returns complete time format with trimming', () => {
		// given
		settings.trimLeadingZeros = true;

		// when
		const format = getFormat(settings, false);

		// then
		expect(format).toBe('h:m:s');
	});

	it('showHours, showMinutes returns "hh:mm"', () => {
		// given
		settings.showSeconds = false;

		// when
		const format = getFormat(settings, false);

		// then
		expect(format).toBe('hh:mm');
	});

	it('showHours, showMinutes returns "h:m" with trimming', () => {
		// given
		settings.showSeconds = false;
		settings.trimLeadingZeros = true;

		// when
		const format = getFormat(settings, false);

		// then
		expect(format).toBe('h:m');
	});

	it('showHours, showSeconds returns "hh:ss"', () => {
		// given
		settings.showMinutes = false;

		// when
		const format = getFormat(settings, false);

		// then
		expect(format).toBe('hh:ss');
	});

	it('showHours, showSeconds returns "h:s" with trimming', () => {
		// given
		settings.showMinutes = false;
		settings.trimLeadingZeros = true;

		// when
		const format = getFormat(settings, false);

		// then
		expect(format).toBe('h:s');
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

	it('showHours returns "h" with trimming', () => {
		// given
		settings.showMinutes = false;
		settings.showSeconds = false;
		settings.trimLeadingZeros = true;

		// when
		const format = getFormat(settings, false);

		// then
		expect(format).toBe('h');
	});

	it('showMinutes, showSeconds returns "mm:ss"', () => {
		// given
		settings.showHours = false;

		// when
		const format = getFormat(settings, false);

		// then
		expect(format).toBe('mm:ss');
	});

	it('showMinutes, showSeconds returns "m:s" with trimming', () => {
		// given
		settings.showHours = false;
		settings.trimLeadingZeros = true;

		// when
		const format = getFormat(settings, false);

		// then
		expect(format).toBe('m:s');
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

	it('showHours returns "m" with trimming', () => {
		// given
		settings.showHours = false;
		settings.showSeconds = false;
		settings.trimLeadingZeros = true;

		// when
		const format = getFormat(settings, false);

		// then
		expect(format).toBe('m');
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

	it('showHours returns "s" with trimming', () => {
		// given
		settings.showHours = false;
		settings.showMinutes = false;
		settings.trimLeadingZeros = true;

		// when
		const format = getFormat(settings, false);

		// then
		expect(format).toBe('s');
	});
});
