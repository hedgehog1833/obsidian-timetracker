import { StopwatchState } from './stopwatchState';

export class StopwatchModel {
	static readonly SLIGHTLY_UNDER_ONE_HUNDRED_HOURS_MILLISECONDS: number = 100 * 60 * 60 * 1000 - 500;
	private startedAt: number;
	private pausedAtOffset: number;
	private state: StopwatchState;

	constructor(startedAt: number, pausedAtOffset: number, state: StopwatchState) {
		this.startedAt = startedAt;
		this.pausedAtOffset = pausedAtOffset;
		this.state = state;
	}

	start(): StopwatchState {
		this.startedAt = Date.now();
		this.state = StopwatchState.STARTED;
		return this.state;
	}

	stop(): StopwatchState {
		this.pausedAtOffset = this.calculateOffset();
		this.state = StopwatchState.STOPPED;
		return this.state;
	}

	reset(): StopwatchState {
		this.state = StopwatchState.INITIALIZED;
		this.startedAt = 0;
		this.pausedAtOffset = 0;
		return this.state;
	}

	getElapsedTime(): number {
		let elapsedTime: number;

		if (this.state === StopwatchState.STARTED) {
			const now = Date.now();
			elapsedTime = now - this.startedAt + this.pausedAtOffset;
		} else {
			elapsedTime = this.pausedAtOffset;
		}

		if (elapsedTime >= StopwatchModel.SLIGHTLY_UNDER_ONE_HUNDRED_HOURS_MILLISECONDS) {
			this.startedAt = Date.now();
			this.pausedAtOffset = 0;
			elapsedTime = 0;
		}

		return elapsedTime;
	}

	setCurrentValue(milliseconds: number): void {
		this.startedAt = milliseconds;
		this.pausedAtOffset = Date.now() - this.startedAt;
	}

	getStartedAt(): number {
		return this.startedAt;
	}

	getPausedAtOffset(): number {
		return this.pausedAtOffset;
	}

	getState(): StopwatchState {
		return this.state;
	}

	calculateOffset(): number {
		return Date.now() - this.startedAt + this.pausedAtOffset;
	}
}
