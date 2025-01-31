import { StopwatchState } from './stopwatchState';
import format from './momentWrapper';
import { COMPLETE_TIME_FORMAT } from './formatSettings';

export class StopwatchModel {
	private readonly SLIGHTLY_UNDER_ONE_HUNDRED_HOURS_MILLISECONDS: number = 100 * 60 * 60 * 1000 - 500;
	private currentTimeFormat: string;
	private startedAt: number = 0;
	private pausedAtOffset: number = 0;
	private state: StopwatchState = StopwatchState.INITIALIZED;

	constructor(currentFormat: string) {
		this.currentTimeFormat = currentFormat;
	}

	start(): StopwatchState {
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

	getCurrentValue(complete?: boolean): string {
		let elapsedTime: number;

		if (this.state === StopwatchState.STARTED) {
			const now = Date.now();
			elapsedTime = now - this.startedAt + this.pausedAtOffset;
		} else {
			elapsedTime = this.pausedAtOffset;
		}

		if (elapsedTime >= this.SLIGHTLY_UNDER_ONE_HUNDRED_HOURS_MILLISECONDS) {
			this.startedAt = Date.now();
			this.pausedAtOffset = 0;
			elapsedTime = 0;
		}

		const currentFormat = complete ? COMPLETE_TIME_FORMAT : this.currentTimeFormat;
		return format(elapsedTime, currentFormat);
	}

	setCurrentValue(milliseconds: number): void {
		this.startedAt = milliseconds;
		this.pausedAtOffset = Date.now() - this.startedAt;
	}

	setCurrentFormat(newFormat: string): void {
		this.currentTimeFormat = newFormat;
	}
}
