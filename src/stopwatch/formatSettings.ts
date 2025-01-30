import { TimetrackerSettings } from '../main';

export function getFormat(settings: TimetrackerSettings, complete?: boolean): string {
	const COMPLETE_TIME_FORMAT = 'HH:mm:ss';
	if (complete || (settings.showHours && settings.showMinutes && settings.showSeconds)) {
		return COMPLETE_TIME_FORMAT;
	}
	if (settings.showHours && settings.showMinutes && !settings.showSeconds) {
		return 'HH:mm';
	}
	if (settings.showHours && !settings.showMinutes && settings.showSeconds) {
		return 'HH:ss';
	}
	if (settings.showHours && !settings.showMinutes && !settings.showSeconds) {
		return 'HH';
	}
	if (!settings.showHours && settings.showMinutes && settings.showSeconds) {
		return 'mm:ss';
	}
	if (!settings.showHours && settings.showMinutes && !settings.showSeconds) {
		return 'mm';
	}
	if (!settings.showHours && !settings.showMinutes && settings.showSeconds) {
		return 'ss';
	}
	console.warn('should not happen: unknown time format, defaulting to HH:mm:ss');
	return COMPLETE_TIME_FORMAT;
}
