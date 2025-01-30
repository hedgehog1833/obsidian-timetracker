import { StopwatchState } from './stopwatchState';
import { TimetrackerSettings } from '../main';
import { format } from './momentWrapper';
import { getFormat } from './formatSettings';

export class StopwatchModel {
	private settings: TimetrackerSettings;
	private startedAt: number = 0;
	private pausedAtOffset: number = 0;
	private state: StopwatchState = StopwatchState.INITIALIZED;
	private readonly SLIGHTLY_UNDER_ONE_HUNDRED_HOURS_MILLISECONDS: number = 100 * 60 * 60 * 1000 - 500;
	private readonly COMPLETE_TIME_FORMAT = 'HH:mm:ss';

	constructor(settings: TimetrackerSettings) {
		this.settings = settings;
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

		return format(elapsedTime, getFormat(this.settings, complete));
	}

	setCurrentValue(milliseconds: number): void {
		this.startedAt = milliseconds;
		this.pausedAtOffset = Date.now() - this.startedAt;
	}
}
