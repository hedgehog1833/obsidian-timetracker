import { StopwatchState } from './StopwatchState';
import dayjs from 'dayjs';

export class StopwatchModel {
	private startedAt: dayjs.Dayjs | null = null;
	private pausedAtOffset: number = 0;
	private state: StopwatchState = StopwatchState.INITIALIZED;

	start(): StopwatchState {
		this.startedAt = dayjs();
		this.state = StopwatchState.STARTED;
		return this.state;
	}

	stop(): StopwatchState {
		this.pausedAtOffset = dayjs().diff(this.startedAt, 'millisecond') + this.pausedAtOffset;
		this.state = StopwatchState.STOPPED;
		return this.state;
	}

	reset(): StopwatchState {
		this.state = StopwatchState.INITIALIZED;
		this.startedAt = null;
		this.pausedAtOffset = 0;
		return this.state;
	}

	getCurrentValue(format: string): string {
		if (this.state == StopwatchState.STARTED) {
			const now = dayjs();
			const diff = now.diff(this.startedAt, 'millisecond') + this.pausedAtOffset;
			return this.getDateString(diff, format);
		}
		return this.getDateString(this.pausedAtOffset, format);
	}

	private getDateString(milliseconds: number, format: string): string {
		return dayjs().startOf('year').add(milliseconds, 'millisecond').format(format);
	}
}
