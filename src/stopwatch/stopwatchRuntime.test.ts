import { Plugin } from 'obsidian';
import { StopwatchController } from './stopwatchController';
import {
	registerStopwatchRuntime,
	SAVE_WORKSPACE_INTERVAL_MILLISECONDS,
	STOPWATCH_INTERVAL_MILLISECONDS,
} from './stopwatchRuntime';

describe('registerStopwatchRuntime', () => {
	let stopwatch: StopwatchController;
	let requestSaveLayout: jest.Mock;
	let persistenceEnabled: boolean;
	let registered: (() => void)[];
	let intervals: number[];
	let plugin: Plugin;

	const setup = () => {
		registerStopwatchRuntime(plugin, stopwatch, {
			requestSaveLayout,
			isPersistenceEnabled: () => persistenceEnabled,
		});
	};

	beforeEach(() => {
		jest.useFakeTimers();
		jest.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
		stopwatch = new StopwatchController();
		requestSaveLayout = jest.fn();
		persistenceEnabled = true;
		registered = [];
		intervals = [];
		plugin = {
			register: (cb: () => void) => registered.push(cb),
			registerInterval: (id: number) => {
				intervals.push(id);
				return id;
			},
		} as unknown as Plugin;
	});

	afterEach(() => {
		intervals.forEach((id) => window.clearInterval(id));
		jest.useRealTimers();
	});

	it('should notify subscribers once per interval while running', () => {
		// given
		setup();
		const listener = jest.fn();
		stopwatch.subscribe(listener);
		stopwatch.start();
		listener.mockClear();

		// when
		jest.advanceTimersByTime(STOPWATCH_INTERVAL_MILLISECONDS * 3);

		// then
		expect(listener).toHaveBeenCalledTimes(3);
	});

	it('should not notify subscribers while stopped', () => {
		// given
		setup();
		const listener = jest.fn();
		stopwatch.subscribe(listener);

		// when
		jest.advanceTimersByTime(STOPWATCH_INTERVAL_MILLISECONDS * 3);

		// then
		expect(listener).not.toHaveBeenCalled();
	});

	it('should save immediately when the stopwatch is not running', () => {
		// given
		setup();

		// when
		stopwatch.reset();

		// then
		expect(requestSaveLayout).toHaveBeenCalledTimes(1);
	});

	it('should save at most once per minute while running', () => {
		// given
		setup();

		// when
		stopwatch.start();

		// then
		expect(requestSaveLayout).toHaveBeenCalledTimes(1);

		// when
		jest.advanceTimersByTime(SAVE_WORKSPACE_INTERVAL_MILLISECONDS - STOPWATCH_INTERVAL_MILLISECONDS);

		// then
		expect(requestSaveLayout).toHaveBeenCalledTimes(1);

		// when
		jest.advanceTimersByTime(STOPWATCH_INTERVAL_MILLISECONDS);

		// then
		expect(requestSaveLayout).toHaveBeenCalledTimes(2);
	});

	it('should not save when persistence is disabled', () => {
		// given
		persistenceEnabled = false;
		setup();

		// when
		stopwatch.start();
		stopwatch.stop();

		// then
		expect(requestSaveLayout).not.toHaveBeenCalled();
	});

	it('should register the subscription for removal on unload', () => {
		// given
		setup();
		const listener = jest.fn();
		stopwatch.subscribe(listener);
		stopwatch.start();

		// when
		registered.forEach((unregister) => unregister());
		requestSaveLayout.mockClear();
		stopwatch.reset();

		// then
		expect(requestSaveLayout).not.toHaveBeenCalled();
	});

	it('should register the repaint interval for cleanup on unload', () => {
		// when
		setup();

		// then
		expect(intervals).toHaveLength(1);
	});
});
