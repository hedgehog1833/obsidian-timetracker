import { StopwatchState } from './stopwatchState';

export class StopwatchModel {
	static readonly SLIGHTLY_UNDER_ONE_HUNDRED_HOURS_MILLISECONDS: number = 100 * 60 * 60 * 1000 - 500;
	private startedAt: number = 0;
	private pausedAtOffset: number = 0;
	private state: StopwatchState = StopwatchState.INITIALIZED;

	constructor(startedAt: number, offset: number) {
		this.startedAt = startedAt;
		this.pausedAtOffset = offset;
	}

	start(): StopwatchState {
		console.log('asdfasdfasdfasdf');
		this.startedAt = Date.now();
		this.state = StopwatchState.STARTED;
		return this.state;
	}

	stop(): StopwatchState {
		this.pausedAtOffset = Date.now() - this.startedAt + this.pausedAtOffset;
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
}
