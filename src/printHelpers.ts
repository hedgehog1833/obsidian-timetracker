import { TimetrackerSettings } from './main';
import getFormat from './stopwatch/formatSettings';
import format from './stopwatch/formatter';

export interface TimeValues {
	hours: string;
	minutes: string;
	seconds: string;
}

export interface TokenPatterns {
	hours: string;
	minutes: string;
	seconds: string;
}

export const replaceTokens = (format: string, values: TimeValues, patterns: TokenPatterns): string => {
	if (!format) return '';

	return format
		.split(patterns.hours)
		.join(values.hours)
		.split(patterns.minutes)
		.join(values.minutes)
		.split(patterns.seconds)
		.join(values.seconds);
};

export const buildPrintValue = (
	settings: TimetrackerSettings,
	elapsedTime: number,
	containerEl: HTMLElement,
): string => {
	const timeValues: TimeValues = getCurrentTimeValues(elapsedTime, settings.trimLeadingZeros);
	let printValue: string;
	if (settings.printFormat.length > 0) {
		printValue = replaceTokens(settings.printFormat, timeValues, {
			hours: '${hours}',
			minutes: '${minutes}',
			seconds: '${seconds}',
		} as TokenPatterns);
	} else {
		printValue = replaceTokens(getFormat(settings), timeValues, {
			hours: 'hh',
			minutes: 'mm',
			seconds: 'ss',
		} as TokenPatterns);
	}
	printValue = applyTextColor(printValue, settings.textColor, containerEl);
	return appendSuffix(printValue, settings.lineBreakAfterInsert);
};

export const applyTextColor = (printValue: string, userTextColor: string, containerEl: HTMLElement): string => {
	const textColor = window.getComputedStyle(containerEl)?.color;
	return userTextColor !== rgbToHex(textColor)
		? `<span style="color:${userTextColor};">${printValue}</span>`
		: printValue;
};

export const appendSuffix = (printValue: string, lineBreakAfterInsert: boolean): string => {
	const suffix = lineBreakAfterInsert ? '\n' : ('\u200B ' as string);
	return `${printValue}${suffix}`;
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

export const loadFirstTextColor = (settings: TimetrackerSettings): boolean => {
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
