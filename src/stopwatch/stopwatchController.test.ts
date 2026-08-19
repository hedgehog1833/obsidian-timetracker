import { StopwatchController } from './stopwatchController';
import { StopwatchModel } from './stopwatchModel';
import { StopwatchState } from './stopwatchState';

describe('StopwatchController', () => {
	let underTest: StopwatchController;

	beforeEach(() => {
		underTest = new StopwatchController();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('starts out initialized and not running', () => {
		// then
		expect(underTest.getState()).toBe(StopwatchState.INITIALIZED);
		expect(underTest.isRunning()).toBe(false);
		expect(underTest.getElapsedTime()).toBe(0);
	});

	it('start/stop transition the state and notify subscribers', () => {
		// given
		const listener = jest.fn();
		underTest.subscribe(listener);

		// when
		underTest.start();

		// then
		expect(underTest.isRunning()).toBe(true);
		expect(listener).toHaveBeenCalledTimes(1);

		// when
		underTest.stop();

		// then
		expect(underTest.getState()).toBe(StopwatchState.STOPPED);
		expect(listener).toHaveBeenCalledTimes(2);
	});

	it('startOrStop toggles', () => {
		// when
		underTest.startOrStop();

		// then
		expect(underTest.isRunning()).toBe(true);

		// when
		underTest.startOrStop();

		// then
		expect(underTest.isRunning()).toBe(false);
	});

	it('start on a running stopwatch is a no-op and does not notify', () => {
		// given
		underTest.start();
		const listener = jest.fn();
		underTest.subscribe(listener);

		// when
		underTest.start();

		// then
		expect(listener).not.toHaveBeenCalled();
	});

	it('stop on a stopped stopwatch is a no-op and does not corrupt the value', () => {
		// given
		const listener = jest.fn();
		underTest.subscribe(listener);

		// when
		underTest.stop();

		// then
		expect(underTest.getElapsedTime()).toBe(0);
		expect(listener).not.toHaveBeenCalled();
	});

	it('reset clears the value and notifies', () => {
		// given
		underTest.start();
		const listener = jest.fn();
		underTest.subscribe(listener);

		// when
		underTest.reset();

		// then
		expect(underTest.getState()).toBe(StopwatchState.INITIALIZED);
		expect(underTest.getElapsedTime()).toBe(0);
		expect(listener).toHaveBeenCalledTimes(1);
	});

	it('setStartTimestamp sets the elapsed time to now minus the given timestamp', () => {
		// given
		const now = 1_700_000_000_000;
		jest.useFakeTimers().setSystemTime(now);

		// when
		underTest.setStartTimestamp(now - 5000);

		// then
		expect(underTest.getElapsedTime()).toBe(5000);
	});

	it('setStartTimestamp on a running stopwatch does not double-count', () => {
		// given
		const now = 1_700_000_000_000;
		jest.useFakeTimers().setSystemTime(now);
		underTest.start();

		// when
		underTest.setStartTimestamp(now - 5000);

		// then
		expect(underTest.getElapsedTime()).toBe(5000);
	});

	it('getPersistentState reports the running offset only when persistence is enabled', () => {
		// given
		const now = 1_700_000_000_000;
		jest.useFakeTimers().setSystemTime(now);
		underTest.start();
		jest.setSystemTime(now + 3000);

		// then
		expect(underTest.getPersistentState(true).persistedOffset).toBe(3000);
		expect(underTest.getPersistentState(false).persistedOffset).toBe(0);
	});

	it('restore brings back a stopped stopwatch with its offset', () => {
		// given
		const listener = jest.fn();
		underTest.subscribe(listener);

		// when
		underTest.restore({ startedAt: 1000, offset: 5000, state: StopwatchState.STOPPED, persistedOffset: 0 }, true);

		// then
		expect(underTest.getState()).toBe(StopwatchState.STOPPED);
		expect(underTest.getElapsedTime()).toBe(5000);
		expect(listener).toHaveBeenCalled();
	});

	it('restore prefers persistedOffset and comes back stopped when it was running', () => {
		// when
		underTest.restore({ startedAt: 1000, offset: 5000, state: StopwatchState.STARTED, persistedOffset: 9000 }, true);

		// then
		expect(underTest.getState()).toBe(StopwatchState.STOPPED);
		expect(underTest.getElapsedTime()).toBe(9000);
	});

	it('restore discards the value when persistence is disabled', () => {
		// when
		underTest.restore({ startedAt: 1000, offset: 5000, state: StopwatchState.STOPPED, persistedOffset: 9000 }, false);

		// then
		expect(underTest.getState()).toBe(StopwatchState.INITIALIZED);
		expect(underTest.getElapsedTime()).toBe(0);
	});

	it('restore ignores empty or missing state', () => {
		// when
		underTest.restore(null as any, true);
		underTest.restore({ startedAt: 0, offset: 0, state: StopwatchState.INITIALIZED, persistedOffset: 0 }, true);

		// then
		expect(underTest.getState()).toBe(StopwatchState.INITIALIZED);
	});

	it('subscribe returns an unsubscribe function', () => {
		// given
		const listener = jest.fn();
		const unsubscribe = underTest.subscribe(listener);

		// when
		unsubscribe();
		underTest.start();

		// then
		expect(listener).not.toHaveBeenCalled();
	});

	it('accepts a pre-built model', () => {
		// given
		const model = new StopwatchModel(0, 4200, StopwatchState.STOPPED);

		// when
		underTest = new StopwatchController(model);

		// then
		expect(underTest.getElapsedTime()).toBe(4200);
	});
});
