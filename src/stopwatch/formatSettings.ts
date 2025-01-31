import { TimetrackerSettings } from '../main';

export const COMPLETE_TIME_FORMAT: string = 'HH:mm:ss';

const getFormat = (settings: TimetrackerSettings, complete?: boolean): string => {
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
	return 'ss';
};

export default getFormat;
