import { TIMETRACKER_VIEW_TYPE, TimetrackerSettings } from '../main';
import { StopwatchController } from '../stopwatch/stopwatchController';
import { StopwatchState } from '../stopwatch/stopwatchState';
import { TimetrackerView } from './TimetrackerView';

describe('TimetrackerView (unit tests)', () => {
	let view: TimetrackerView;
	let stopwatch: StopwatchController;
	let settings: TimetrackerSettings;

	beforeEach(() => {
		settings = {
			trimLeadingZeros: true,
			showHours: true,
			showMinutes: true,
			showSeconds: true,
			persistTimerValue: false,
		} as TimetrackerSettings;

		stopwatch = new StopwatchController();
		view = new TimetrackerView({} as any, settings, stopwatch);
		view.containerEl = document.createElement('div');
	});

	it('onOpen renders the StopwatchArea into container', async () => {
		// when
		await view.onOpen();

		// then
		expect(view.containerEl.querySelector('[data-testid="start-stop-button"]')).toBeDefined();
	});

	it('getDisplayText / getViewType / getIcon return expected constants', () => {
		// then
		expect(view.getDisplayText()).toBe('Timetracker');
		expect(view.getViewType()).toBe(TIMETRACKER_VIEW_TYPE);
		expect(view.getIcon()).toBe('clock');
	});

	it('getElapsedTime delegates to the plugin-owned stopwatch', () => {
		// given
		const spy = jest.spyOn(stopwatch, 'getElapsedTime').mockReturnValue(321);

		// when
		const elapsed = view.getElapsedTime();

		// then
		expect(spy).toHaveBeenCalled();
		expect(elapsed).toBe(321);
	});

	it('holds no stopwatch state of its own: getState reflects the controller', () => {
		// when
		stopwatch.start();

		// then
		expect(view.getState().state).toBe(StopwatchState.STARTED);

		// when
		stopwatch.stop();

		// then
		expect(view.getState().state).toBe(StopwatchState.STOPPED);
	});

	it('setState restores the controller when persistence is enabled', async () => {
		// given
		settings.persistTimerValue = true;
		const persisted = {
			startedAt: 1000,
			offset: 5000,
			state: StopwatchState.STARTED,
			persistedOffset: 2000,
		};

		// when
		await view.setState(persisted as any, {} as any);

		// then
		expect(view.getState().state).toBe(StopwatchState.STOPPED);
		expect(stopwatch.getElapsedTime()).toBe(2000);
	});

	it('setState discards the persisted value when persistence is disabled', async () => {
		// given
		settings.persistTimerValue = false;
		const persisted = {
			startedAt: 1000,
			offset: 5000,
			state: StopwatchState.STARTED,
			persistedOffset: 2000,
		};

		// when
		await view.setState(persisted as any, {} as any);

		// then
		expect(view.getState().state).toBe(StopwatchState.INITIALIZED);
		expect(stopwatch.getElapsedTime()).toBe(0);
	});

	it('onClose unmounts the react root and stops re-rendering', async () => {
		// given
		await view.onOpen();

		// when
		await view.onClose();

		// then
		expect(() => stopwatch.start()).not.toThrow();
	});
});
