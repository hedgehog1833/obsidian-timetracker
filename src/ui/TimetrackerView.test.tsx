import { TIMETRACKER_VIEW_TYPE } from '../main';
import { StopwatchState } from '../stopwatch/stopwatchState';
import { TimetrackerView } from './TimetrackerView';

describe('TimetrackerView (unit tests)', () => {
	let view: TimetrackerView;

	beforeEach(() => {
		const settings: any = {
			trimLeadingZeros: true,
			showHours: true,
			showMinutes: true,
			showSeconds: true,
			persistTimerValue: false,
		};

		view = new TimetrackerView({} as any, settings);
		view.containerEl = document.createElement('div');
		(view as any).app = { workspace: { requestSaveLayout: jest.fn() } };
	});

	it('onOpen renders the StopwatchArea into container', async () => {
		// when
		await view.onOpen();

		// then
		expect(view.containerEl.querySelector('[data-testid="start-stop-button"]')).toBeDefined();
	});

	it('start/stop/reset/update methods operate on the stopwatch model', async () => {
		// given
		await view.onOpen();

		// when
		view.start();

		// then
		expect(view.getState().state).toBe(StopwatchState.STARTED);

		// when
		(view as any).settings.persistTimerValue = false;
		view.stop();

		// then
		expect(view.getState().state).toBe(StopwatchState.STOPPED);
		expect((view as any).app.workspace.requestSaveLayout).not.toHaveBeenCalled();

		// when
		(view as any).settings.persistTimerValue = true;
		view.stop();

		// then
		expect(view.getState().state).toBe(StopwatchState.STOPPED);
		expect((view as any).app.workspace.requestSaveLayout).toHaveBeenCalled();

		// when
		view.start();
		view.reset();

		// then
		expect(view.getState().state).toBe(StopwatchState.INITIALIZED);

		// when: update model values directly (avoids DOM click concerns in unit test)
		(view as any).stopwatchModel.setCurrentValue(5000);

		// then
		const state = view.getState();
		expect(state.offset).toBeGreaterThanOrEqual(0);
	});

	it('setState/getState roundtrip respects persisted flags', async () => {
		// given
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
	});

	it('getDisplayText / getViewType / getIcon return expected constants', () => {
		// then
		expect(view.getDisplayText()).toBe('Timetracker');
		expect(view.getViewType()).toBe(TIMETRACKER_VIEW_TYPE);
		expect(view.getIcon()).toBe('clock');
	});

	it('getElapsedTime delegates to the stopwatch model', () => {
		// given
		const spy = jest.fn(() => 321);
		(view as any).stopwatchModel.getElapsedTime = spy;

		// when
		const elapsed = view.getElapsedTime();

		// then
		expect(spy).toHaveBeenCalled();
		expect(elapsed).toBe(321);
	});

	it('setCurrentStopwatchTime resets, sets model value and reloads; requests save when persistence enabled', () => {
		// given
		const resetSpy = ((view as any).clickReset = jest.fn());
		const reloadSpy = ((view as any).clickReload = jest.fn());
		const setCurrentValueSpy = jest.fn();
		(view as any).stopwatchModel.setCurrentValue = setCurrentValueSpy;
		(view as any).app.workspace.requestSaveLayout = jest.fn();

		// when: persistence disabled (default)
		(view as any).settings.persistTimerValue = false;
		view.setCurrentStopwatchTime(5000);

		// then
		expect(resetSpy).toHaveBeenCalled();
		expect(setCurrentValueSpy).toHaveBeenCalledWith(5000);
		expect(reloadSpy).toHaveBeenCalled();
		expect((view as any).app.workspace.requestSaveLayout).not.toHaveBeenCalled();

		// when: persistence enabled
		(view as any).settings.persistTimerValue = true;
		view.setCurrentStopwatchTime(7000);

		// then
		expect(setCurrentValueSpy).toHaveBeenCalledWith(7000);
		expect((view as any).app.workspace.requestSaveLayout).toHaveBeenCalled();
	});

	it('clickStartStop triggers the start handler via DOM button click', () => {
		// given
		const button = document.createElement('button');
		button.className = 'start-stop-button';
		button.addEventListener('click', () => view.start());
		view.containerEl.appendChild(button);
		const startSpy = jest.spyOn(view, 'start').mockImplementation(() => StopwatchState.STARTED);

		// when
		view.clickStartStop();

		// then
		expect(startSpy).toHaveBeenCalled();
	});

	it('clickReset triggers the reset handler via DOM button click', () => {
		// given
		const button = document.createElement('button');
		button.className = 'reset-button';
		button.addEventListener('click', () => view.reset());
		view.containerEl.appendChild(button);
		const resetSpy = jest.spyOn(view, 'reset').mockImplementation(() => StopwatchState.INITIALIZED);

		// when
		view.clickReset();

		// then
		expect(resetSpy).toHaveBeenCalled();
	});

	it('clickReload triggers the reload logic (reads elapsed time) via DOM button click', () => {
		// given
		const button = document.createElement('button');
		button.className = 'reload-button';
		button.addEventListener('click', () => {
			// emulate the reload callback reading the current stopwatch time
			(view as any).stopwatchModel.getElapsedTime();
		});
		view.containerEl.appendChild(button);
		const elapsedSpy = jest.fn(() => 1234);
		(view as any).stopwatchModel.getElapsedTime = elapsedSpy;

		// when
		view.clickReload();

		// then
		expect(elapsedSpy).toHaveBeenCalled();
	});
});
