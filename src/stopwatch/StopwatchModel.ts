import { StopwatchState } from './StopwatchState';
import { moment } from 'obsidian';
import Timetracker from '../main';

export class StopwatchModel {
	private plugin: Timetracker;
	private startedAt: number = 0;
	private pausedAtOffset: number = 0;
	private state: StopwatchState = StopwatchState.INITIALIZED;
	private readonly SLIGHTLY_UNDER_ONE_HUNDRED_HOURS_MILLISECONDS: number = 100 * 60 * 60 * 1000 - 500;
	private readonly COMPLETE_TIME_FORMAT = 'HH:mm:ss';

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

	getCurrentValue(complete?: boolean): string {
		let elapsedTime = 0;

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

		return this.getDateString(elapsedTime, complete);
	}

	setCurrentValue(milliseconds: number): void {
		this.startedAt = milliseconds;
		this.pausedAtOffset = Date.now() - this.startedAt;
	}

	private getDateString(milliseconds: number, complete?: boolean): string {
		const formattingSettings = !this.plugin.settings.trimLeadingZeros
			? {
					trim: 'false',
				}
			: {
					trim: 'left',
				};
		return moment.duration(milliseconds).format(this.getFormat(complete), formattingSettings);
	}

	private getFormat(complete?: boolean): string {
		if (complete) {
			return this.COMPLETE_TIME_FORMAT;
		}
		if (this.plugin.settings.showHours && this.plugin.settings.showMinutes && this.plugin.settings.showSeconds) {
			return this.COMPLETE_TIME_FORMAT;
		}
		if (this.plugin.settings.showHours && this.plugin.settings.showMinutes && !this.plugin.settings.showSeconds) {
			return 'HH:mm';
		}
		if (this.plugin.settings.showHours && !this.plugin.settings.showMinutes && this.plugin.settings.showSeconds) {
			return 'HH:ss';
		}
		if (this.plugin.settings.showHours && !this.plugin.settings.showMinutes && !this.plugin.settings.showSeconds) {
			return 'HH';
		}
		if (!this.plugin.settings.showHours && this.plugin.settings.showMinutes && this.plugin.settings.showSeconds) {
			return 'mm:ss';
		}
		if (!this.plugin.settings.showHours && this.plugin.settings.showMinutes && !this.plugin.settings.showSeconds) {
			return 'mm';
		}
		if (!this.plugin.settings.showHours && !this.plugin.settings.showMinutes && this.plugin.settings.showSeconds) {
			return 'ss';
		}
		return this.COMPLETE_TIME_FORMAT;
	}
}
