import { TimetrackerSettings } from '../main';

export const COMPLETE_TIME_FORMAT: string = 'HH:mm:ss';

const getFormat = (settings: TimetrackerSettings, complete?: boolean): string => {
	if (
		complete === true ||
		(settings.showHours === true && settings.showMinutes === true && settings.showSeconds === true)
	) {
		return COMPLETE_TIME_FORMAT;
	}
	if (settings.showHours === true && settings.showMinutes === true && settings.showSeconds === false) {
		return 'HH:mm';
	}
	if (settings.showHours === true && settings.showMinutes === false && settings.showSeconds === true) {
		return 'HH:ss';
	}
	if (settings.showHours === true && settings.showMinutes === false && settings.showSeconds === false) {
		return 'HH';
	}
	if (settings.showHours === false && settings.showMinutes === true && settings.showSeconds === true) {
		return 'mm:ss';
	}
	if (settings.showHours === false && settings.showMinutes === true && settings.showSeconds === false) {
		return 'mm';
	}
	return 'ss';
};

export default getFormat;
