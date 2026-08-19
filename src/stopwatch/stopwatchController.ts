import { StopwatchModel } from './stopwatchModel';
import { StopwatchState } from './stopwatchState';

export type PersistentStopwatchState = {
	startedAt: number;
	offset: number;
	state: StopwatchState;
	persistedOffset: number;
};

export type StopwatchListener = () => void;

export class StopwatchController {
	private model: StopwatchModel;
	private readonly listeners: Set<StopwatchListener> = new Set();

	constructor(model?: StopwatchModel) {
		this.model = model ?? new StopwatchModel(0, 0, StopwatchState.INITIALIZED);
	}

	getState(): StopwatchState {
		return this.model.getState();
	}

	isRunning(): boolean {
		return this.model.getState() === StopwatchState.STARTED;
	}

	getElapsedTime(): number {
		return this.model.getElapsedTime();
	}

	start(): StopwatchState {
		if (this.isRunning()) {
			return this.getState();
		}
		const state = this.model.start();
		this.notify();
		return state;
	}

	stop(): StopwatchState {
		if (!this.isRunning()) {
			return this.getState();
		}
		const state = this.model.stop();
		this.notify();
		return state;
	}

	startOrStop(): StopwatchState {
		return this.isRunning() ? this.stop() : this.start();
	}

	reset(): StopwatchState {
		const state = this.model.reset();
		this.notify();
		return state;
	}

	setStartTimestamp(startTimestamp: number): void {
		this.model.reset();
		this.model.setCurrentValue(startTimestamp);
		this.notify();
	}

	getPersistentState(persistTimerValue: boolean): PersistentStopwatchState {
		return {
			startedAt: this.model.getStartedAt(),
			offset: this.model.getPausedAtOffset(),
			state: this.model.getState(),
			persistedOffset: persistTimerValue && this.isRunning() ? this.model.calculateOffset() : 0,
		};
	}

	restore(state: PersistentStopwatchState, persistTimerValue: boolean): void {
		if (state == null || !(state.startedAt > 0) || state.state == null) {
			return;
		}

		let adjustedState = state.state === StopwatchState.STARTED ? StopwatchState.STOPPED : state.state;
		let startedAtToUse = state.startedAt;
		let offsetToUse: number;

		if (!persistTimerValue) {
			startedAtToUse = 0;
			offsetToUse = 0;
			adjustedState = StopwatchState.INITIALIZED;
		} else {
			offsetToUse = state.persistedOffset > 0 ? state.persistedOffset : state.offset;
		}

		this.model = new StopwatchModel(startedAtToUse, offsetToUse, adjustedState);
		this.notify();
	}

	subscribe(listener: StopwatchListener): () => void {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	}

	notify(): void {
		this.listeners.forEach((listener) => listener());
	}
}
