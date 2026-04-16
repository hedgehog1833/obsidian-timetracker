import { TimetrackerSettings } from '../main';

export const COMPLETE_TIME_FORMAT: string = 'hh:mm:ss';

const getFormat = (settings: TimetrackerSettings, complete?: boolean): string => {
	let format;
	if (complete === true || (settings.showHours && settings.showMinutes && settings.showSeconds)) {
		format = COMPLETE_TIME_FORMAT;
	} else if (settings.showHours && settings.showMinutes && !settings.showSeconds) {
		format = 'hh:mm';
	} else if (settings.showHours && !settings.showMinutes && settings.showSeconds) {
		format = 'hh:ss';
	} else if (settings.showHours && !settings.showMinutes && !settings.showSeconds) {
		format = 'hh';
	} else if (!settings.showHours && settings.showMinutes && settings.showSeconds) {
		format = 'mm:ss';
	} else if (!settings.showHours && settings.showMinutes && !settings.showSeconds) {
		format = 'mm';
	} else {
		format = 'ss';
	}

	if (settings.trimLeadingZeros) {
		format = format
			.split(':')
			.map((part) => part.slice(1))
			.join(':');
	}

	return format;
};

export default getFormat;
