import { StopwatchModel } from './stopwatchModel';
import { StopwatchState } from './stopwatchState';
import format from './momentWrapper';

jest.mock('./momentWrapper', () => ({
	default: jest.fn(),
}));

describe('stopwatchModel', () => {
	let timeFormat: string;
	let stopwatch: StopwatchModel;
	let nowSpy: jest.SpyInstance;

	beforeEach(() => {
		timeFormat = 'HH:mm:ss';
		stopwatch = new StopwatchModel(timeFormat);
		nowSpy = jest.spyOn(Date, 'now');
	});

	it('start: should set state STARTED', () => {
		// when
		const state = stopwatch.start();

		// then
		expect(state).toBe(StopwatchState.STARTED);
	});

	it('stop: should set state STOPPED', () => {
		// given
		stopwatch.start();

		// when
		const state = stopwatch.stop();

		// then
		expect(state).toBe(StopwatchState.STOPPED);
	});

	it('reset: should set state INITIALIZED', () => {
		// when
		stopwatch.start();
		const state = stopwatch.reset();

		// then
		expect(state).toBe(StopwatchState.INITIALIZED);
	});

	it('getCurrentValue: should call format and return value', () => {
		// given
		(format as jest.Mock).mockReturnValue('01:02:03');

		// when
		const value = stopwatch.getCurrentValue();

		// then
		expect(format).toHaveBeenCalledWith(0, timeFormat);

		// and
		expect(value).toBe('01:02:03');
	});

	it('setCurrentValue: should set the current value of the stopwatch', () => {
		// given
		const elapsedTime = 5000;
		const now = 10000;
		nowSpy.mockImplementation(() => now);

		// when
		stopwatch.setCurrentValue(elapsedTime);
		stopwatch.getCurrentValue();

		// then
		expect(format).toHaveBeenCalledWith(now - elapsedTime, timeFormat);
	});

	it('setCurrentFormat: should set the current format of the stopwatch', () => {
		// given
		const currentFormat = 'HH:mm:ss';
		stopwatch.getCurrentValue();
		expect(format).toHaveBeenCalledWith(expect.any(Number), currentFormat);
		const newFormat = 'mm:ss';

		// when
		stopwatch.setCurrentFormat(newFormat);
		stopwatch.getCurrentValue();

		// then
		expect(format).toHaveBeenCalledWith(expect.any(Number), newFormat);
	});
});
