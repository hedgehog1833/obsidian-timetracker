import { TimetrackerSettings } from 'src/main';
import useFormatTimeValue from './useFormatTimeValue';
import { TimeUnit } from '../timeUnit';

describe('useFormatTimeValue', () => {
	const defaultSettings: TimetrackerSettings = {
		showHours: true,
		showMinutes: true,
		showSeconds: true,
		format: null,
		interval: null,
		trimLeadingZeros: false,
		lineBreakAfterInsert: false,
		textColor: '',
		printFormat: '',
		persistTimerValue: false,
	};

	let settings: TimetrackerSettings;

	beforeEach(() => {
		settings = { ...defaultSettings };
	});

	it('value is trimmed correctly', () => {
		// given
		settings.trimLeadingZeros = true;
		const resultFunction = useFormatTimeValue(settings);
		const stopwatchValue = '01:02:03';

		// when
		const result = resultFunction.doFormatTimeValue(stopwatchValue, TimeUnit.HOURS, false);

		// then
		expect(result).toBe('1');
	});

	it('value is not trimmed when in editing mode', () => {
		// given
		settings.trimLeadingZeros = true;
		const resultFunction = useFormatTimeValue(settings);
		const stopwatchValue = '01:02:03';

		// when
		const result = resultFunction.doFormatTimeValue(stopwatchValue, TimeUnit.HOURS, true);

		// then
		expect(result).toBe('01');
	});

	it('value is not trimmed when it does not start with zero', () => {
		// given
		settings.trimLeadingZeros = true;
		const resultFunction = useFormatTimeValue(settings);
		const stopwatchValue = '11';

		// when
		const result = resultFunction.doFormatTimeValue(stopwatchValue, TimeUnit.HOURS, false);

		// then
		expect(result).toBe('11');
	});

	it('value is formatted per default', () => {
		// given
		const resultFunction = useFormatTimeValue(settings);
		const stopwatchValue = '01:02:03';

		// when
		const result = resultFunction.doFormatTimeValue(stopwatchValue, TimeUnit.HOURS, false);

		// then
		expect(result).toBe('01');
	});

	it('value is formatted when in editing mode', () => {
		// given
		const resultFunction = useFormatTimeValue(settings);
		const stopwatchValue = '00:02:03';

		// when
		const result = resultFunction.doFormatTimeValue(stopwatchValue, TimeUnit.HOURS, true);

		// then
		expect(result).toBe('00');
	});

	it.each([
		[{ showMinutes: false, showSeconds: false }, '00:02:03', '00'],
		[{ showMinutes: false, showSeconds: false }, '00:02:00', '00'],
		[{ showMinutes: false, showSeconds: false }, '00:00:03', '00'],
		[{ showMinutes: false, showSeconds: false }, '00:00:00', ''],
		[{ showMinutes: true, showSeconds: false }, '00:02:03', ''],
		[{ showMinutes: false, showSeconds: true }, '00:02:03', ''],
		[{ showMinutes: true, showSeconds: true }, '00:02:03', ''],
	])('zero hours are formatted if necessary — settings: %p, value: %s', (override, stopwatchValue, expected) => {
		// given
		Object.assign(settings, override);
		const resultFunction = useFormatTimeValue(settings);

		// when
		const result = resultFunction.doFormatTimeValue(stopwatchValue, TimeUnit.HOURS, false);

		// then
		expect(result).toBe(expected);
	});

	it.each([
		[true, '01:00:00', '00'],
		[false, '00:00:03', '00'],
		[true, '00:00:00', ''],
		[false, '00:00:00', ''],
	])(
		'zero minutes are formatted if necessary — showSeconds: %p, value: %s',
		(showSeconds, stopwatchValue, expected) => {
			// given
			settings.showSeconds = showSeconds;
			const resultFunction = useFormatTimeValue(settings);

			// when
			const result = resultFunction.doFormatTimeValue(stopwatchValue, TimeUnit.MINUTES, false);

			// then
			expect(result).toBe(expected);
		},
	);

	it.each([
		['01:00:00', '00'],
		['00:01:00', '00'],
		['00:00:00', ''],
	])('zero seconds are formatted if necessary — value: %s', (stopwatchValue, expected) => {
		// given
		const resultFunction = useFormatTimeValue(settings);

		// when
		const result = resultFunction.doFormatTimeValue(stopwatchValue, TimeUnit.SECONDS, false);

		// then
		expect(result).toBe(expected);
	});
});
