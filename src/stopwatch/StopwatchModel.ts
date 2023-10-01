import { StopwatchState } from './StopwatchState';
import moment from 'moment';

export class StopwatchModel {
	private startedAt: number = 0;
	private pausedAtOffset: number = 0;
	private state: StopwatchState = StopwatchState.INITIALIZED;

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

	getCurrentValue(format: string): string {
		if (this.state === StopwatchState.STARTED) {
			const now = Date.now();
			const diff = now - this.startedAt + this.pausedAtOffset;
			return this.getDateString(diff, format);
		}
		return this.getDateString(this.pausedAtOffset, format);
	}

	private getDateString(milliseconds: number, format: string): string {
		return moment.duration(milliseconds).format(format, {
			trim: false,
		});
	}
}
