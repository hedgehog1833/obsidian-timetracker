import format from './stopwatch/formatter';
import { TimeValues, TokenPatterns } from './stopwatch/printHelpers';
import replaceTokens from './stopwatch/printHelpers';
import getFormat from './stopwatch/formatSettings';
import { TimetrackerSettings } from './main';

export const migrateFormat = (settings: any): boolean => {
	if (settings?.format != null && settings.format.length > 0) {
		settings.showHours = settings.format.includes('H') || settings.format.includes('h');
		settings.showMinutes = settings.format.includes('M') || settings.format.includes('m');
		settings.showSeconds = settings.format.includes('S') || settings.format.includes('s');
		settings.format = null;
		settings.interval = null;
		return true;
	}
	return false;
};

export const rgbToHex = (rgbColor: string): string => {
	if (rgbColor && rgbColor.length > 0) {
		const rgbValues = rgbColor.slice(4, -1);
		const [r, g, b] = rgbValues.split(',').map((value: string) => parseInt(value));
		const componentToHex = (c: number) => {
			const hex = c.toString(16);
			return hex.length === 1 ? '0' + hex : hex;
		};
		return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
	}
	return '#dadada';
};

export const loadFirstTextColor = (settings: any): boolean => {
	if (settings?.textColor?.length === 0) {
		settings.textColor = '#dadada';
		return true;
	}
	return false;
};

export const getCurrentTimeValues = (elapsedTime: number, trimLeadingZeros: boolean): TimeValues => {
	const stopwatchValues = format(elapsedTime).split(':');
	const [hours, minutes, seconds] = stopwatchValues.map((value: string) =>
		trimLeadingZeros ? parseInt(value).toString() : value,
	);
	return { hours: hours, minutes: minutes, seconds: seconds } as TimeValues;
};

export const buildPrintValue = (settings: TimetrackerSettings, timeValues: TimeValues): string => {
	if (settings.printFormat.length > 0) {
		return replaceTokens(settings.printFormat, timeValues, {
			hours: '${hours}',
			minutes: '${minutes}',
			seconds: '${seconds}',
		} as TokenPatterns);
	}

	return replaceTokens(getFormat(settings), timeValues, {
		hours: 'hh',
		minutes: 'mm',
		seconds: 'ss',
	} as TokenPatterns);
};

export const applyTextColor = (printValue: string, userTextColor: string, containerEl: HTMLElement): string => {
	const textColor = window.getComputedStyle(containerEl)?.color;
	return userTextColor !== rgbToHex(textColor)
		? `<span style="color:${userTextColor};">${printValue}</span>`
		: printValue;
};
