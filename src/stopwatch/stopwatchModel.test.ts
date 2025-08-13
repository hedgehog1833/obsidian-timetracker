import { StopwatchModel } from './stopwatchModel';
import { StopwatchState } from './stopwatchState';

jest.mock('./momentWrapper', () => ({
	default: jest.fn(),
}));

describe('stopwatchModel', () => {
	let underTest: StopwatchModel;

	beforeEach(() => {
		underTest = new StopwatchModel(0, 0);
	});

	it('start: should set state STARTED', () => {
		// when
		const state = underTest.start();

		// then
		expect(state).toBe(StopwatchState.STARTED);
	});

	it('start: should start timer', () => {
		// given
		jest.useFakeTimers();
		const currentMilliseconds = Date.now();

		// when
		underTest.start();
		jest.setSystemTime(new Date(currentMilliseconds + 1000));
		const value = underTest.getStartedAt();

		// then
		expect(value).toBe(currentMilliseconds);
	});

	it('stop: should set state STOPPED', () => {
		// when
		underTest.start();
		const state = underTest.stop();

		// then
		expect(state).toBe(StopwatchState.STOPPED);
	});

	it('stop: should stop timer', () => {
		// given
		jest.useFakeTimers();
		const currentMilliseconds = Date.now();

		// when
		underTest.start();
		jest.setSystemTime(new Date(currentMilliseconds + 1000));

		const value1 = underTest.getStartedAt();
		underTest.stop();
		const value2 = underTest.getStartedAt();

		jest.setSystemTime(new Date(currentMilliseconds + 2000));
		const value3 = underTest.getStartedAt();

		// then
		expect(value1).toBe(currentMilliseconds);
		expect(value2).toBe(value1);
		expect(value3).toBe(value2);
	});

	it('reset: should set state INITIALIZED and clear values', () => {
		// given
		underTest = new StopwatchModel(5000, 10000);

		// when
		const state = underTest.reset();

		// then
		expect(state).toBe(StopwatchState.INITIALIZED);
		expect(underTest.getStartedAt()).toBe(0);
		expect(underTest.getPausedAtOffset()).toBe(0);
	});

	it('getStartedAt: returns startedAt', () => {
		// given
		underTest = new StopwatchModel(10000, 0);

		// when
		const value = underTest.getStartedAt();

		// then
		expect(value).toBe(10000);
	});

	it('getPausedAtOffset: returns offset', () => {
		// given
		underTest = new StopwatchModel(0, 10000);

		// when
		const value = underTest.getPausedAtOffset();

		// then
		expect(value).toBe(10000);
	});

	it('getElapsedTime: should return zero when initialized', () => {
		// when
		const value = underTest.getElapsedTime();

		// then
		expect(value).toBe(0);
	});

	it('getElapsedTime: should calculate elapsed time correctly while running', () => {
		// given
		jest.useFakeTimers();

		// when
		underTest.start();
		jest.setSystemTime(new Date(Date.now() + 1000));
		const value = underTest.getElapsedTime();

		// then
		expect(value).toBe(1000);
	});

	it('getElapsedTime: should include paused offset after stopping', () => {
		// given
		jest.useFakeTimers();
		const currentTimeMillis = Date.now();
		jest.setSystemTime(new Date(currentTimeMillis + 2000));

		// when
		underTest.start();
		jest.setSystemTime(new Date(currentTimeMillis + 3000));
		underTest.stop();
		const value = underTest.getElapsedTime();

		// then
		expect(value).toBe(1000);
	});

	it('getElapsedTime: should reset elapsed time after reaching threshold', () => {
		// given
		jest.useFakeTimers();
		const valueSlightlyUnderThreshold = StopwatchModel.SLIGHTLY_UNDER_ONE_HUNDRED_HOURS_MILLISECONDS - 100;

		// when
		underTest.start();
		jest.setSystemTime(new Date(Date.now() + valueSlightlyUnderThreshold));

		// then
		const firstValue = underTest.getElapsedTime();
		expect(firstValue).toBe(valueSlightlyUnderThreshold);

		// when
		jest.setSystemTime(new Date(Date.now() + 101));

		// then
		const secondValue = underTest.getElapsedTime();
		expect(secondValue).toBe(0);
	});

	it('getElapsedTime: should maintain correct timer value after multiple start/stop cycles', () => {
		// given
		jest.useFakeTimers();

		// when
		underTest.start();
		jest.setSystemTime(new Date(Date.now() + 1000));

		// then
		expect(underTest.getElapsedTime()).toBe(1000);

		// when
		underTest.stop();
		jest.setSystemTime(new Date(Date.now() + 2000));

		// then
		expect(underTest.getElapsedTime()).toBe(1000);

		// when
		underTest.start();
		jest.setSystemTime(new Date(Date.now() + 500));

		// then
		expect(underTest.getElapsedTime()).toBe(1500);

		// when
		underTest.stop();
		jest.setSystemTime(new Date(Date.now() + 2000));

		// then
		expect(underTest.getElapsedTime()).toBe(1500);

		// when
		underTest.start();
		jest.setSystemTime(new Date(Date.now() + 500));

		// then
		expect(underTest.getElapsedTime()).toBe(2000);
	});
});
