import { StopwatchState } from './StopwatchState';

export class StopwatchModel {
	private startedAt: Date;
	private pausedAt: Date;
	private state: StopwatchState = StopwatchState.INITIALIZED;

	getState(): StopwatchState {
		return this.state;
	}

	start(): void {
		this.startedAt = new Date();
		this.state = StopwatchState.STARTED;
	}

	stop(): void {
		this.pausedAt = new Date();
		this.state = StopwatchState.STOPPED;
	}

	reset(): void {
		this.state = StopwatchState.INITIALIZED;
	}

	getCurrentValue(): string {
		if (this.state != StopwatchState.INITIALIZED) {
			if (this.pausedAt != null) {
				return (this.pausedAt.getTime() - this.startedAt.getTime()).toString();
			}
			const now = new Date();
			return (now.getTime() - this.startedAt.getTime()).toString();
		}
		return '';
	}
}
