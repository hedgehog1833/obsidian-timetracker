import { StopwatchState } from './StopwatchState';
import { moment } from 'obsidian';
import Timetracker from '../../main';

export class StopwatchModel {
	private plugin: Timetracker;
	private startedAt: number = 0;
	private pausedAtOffset: number = 0;
	private state: StopwatchState = StopwatchState.INITIALIZED;

	constructor(plugin: Timetracker) {
		this.plugin = plugin;
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

	getCurrentValue(): string {
		if (this.state === StopwatchState.STARTED) {
			const now = Date.now();
			const diff = now - this.startedAt + this.pausedAtOffset;
			return this.getDateString(diff);
		}
		return this.getDateString(this.pausedAtOffset);
	}

	private getDateString(milliseconds: number): string {
		const formattingSettings = !this.plugin.settings.trimLeadingZeros
			? {
					trim: 'false',
			  }
			: {
					trim: 'left',
			  };
		return moment.duration(milliseconds).format(this.plugin.settings.format, formattingSettings);
	}
}
