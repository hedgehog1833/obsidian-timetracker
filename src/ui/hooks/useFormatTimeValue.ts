import { TimeUnit } from '../timeUnit';
import { TimetrackerSettings } from '../../main';

const useFormatTimeValue = (settings: TimetrackerSettings) => {
	const doFormatTimeValue = (stopwatchValue: string, timeUnit: TimeUnit, isEditing: boolean): string => {
		const parts = stopwatchValue.split(':');
		let value = parts[timeUnit.valueOf()];

		if (!isEditing && settings.trimLeadingZeros && value.startsWith('0')) {
			value = value.slice(1);
		}

		return satisfiesDefaultConditions(value, isEditing) ||
			(timeUnit === TimeUnit.HOURS &&
				satisfiesHourConditions(parts[TimeUnit.MINUTES.valueOf()], parts[TimeUnit.SECONDS.valueOf()])) ||
			(timeUnit === TimeUnit.MINUTES &&
				satisfiesMinuteConditions(parts[TimeUnit.HOURS.valueOf()], parts[TimeUnit.SECONDS.valueOf()])) ||
			(timeUnit === TimeUnit.SECONDS &&
				satisfiesSecondsConditions(parts[TimeUnit.HOURS], parts[TimeUnit.MINUTES.valueOf()]))
			? value
			: '';
	};

	const satisfiesHourConditions = (minutes: string, seconds: string): boolean => {
		return !settings.showMinutes && !settings.showSeconds && (parseInt(minutes) > 0 || parseInt(seconds) > 0);
	};

	const satisfiesMinuteConditions = (hours: string, seconds: string): boolean => {
		return parseInt(hours) > 0 || (!settings.showSeconds && parseInt(seconds) > 0);
	};

	const satisfiesSecondsConditions = (hours: string, minutes: string): boolean => {
		return parseInt(hours) > 0 || parseInt(minutes) > 0;
	};

	const satisfiesDefaultConditions = (value: string, isEditing: boolean): boolean => {
		return (value !== '0' && value !== '00') || isEditing;
	};

	return { doFormatTimeValue };
};

export default useFormatTimeValue;
