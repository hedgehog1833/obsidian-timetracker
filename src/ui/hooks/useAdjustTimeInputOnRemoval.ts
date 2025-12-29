import React from 'react';
import { TimeUnit } from '../timeUnit';

const useAdjustTimeInputOnRemoval = (focusRef: React.RefObject<HTMLInputElement | null>) => {
	const doAdjustTimeInputOnRemoval = (
		event: React.KeyboardEvent<HTMLInputElement>,
		stopwatchValue: string,
		timeUnit: TimeUnit,
	) => {
		const cursorPosition = focusRef.current?.selectionStart;

		if (cursorPosition != null) {
			const stopwatchValues = fetchStopwatchValues(stopwatchValue, timeUnit);
			const newValue = buildNewValueOnRemoval(event, stopwatchValues.currentValue, cursorPosition);
			return fetchNewValuesOnRemoval(
				stopwatchValues.hours,
				stopwatchValues.minutes,
				stopwatchValues.seconds,
				newValue,
				timeUnit,
			);
		}
	};

	const buildNewValueOnRemoval = (
		event: React.KeyboardEvent<HTMLInputElement>,
		currentValue: number,
		cursorPosition: number,
	) => {
		let newValue = null;
		if ((cursorPosition === 0 && event.key === 'Delete') || (cursorPosition === 1 && event.key === 'Backspace')) {
			newValue = parseInt(currentValue.toString().substring(1));
		} else if (
			(cursorPosition === 1 && event.key === 'Delete') ||
			(cursorPosition === 2 && event.key === 'Backspace')
		) {
			newValue = parseInt(currentValue.toString().slice(0, -1));
		}
		return newValue;
	};

	const fetchStopwatchValues = (stopwatchValue: string, timeUnit: TimeUnit) => {
		const parts = stopwatchValue.split(':');
		const hours = parseInt(parts[TimeUnit.HOURS.valueOf()]);
		const minutes = parseInt(parts[TimeUnit.MINUTES.valueOf()]);
		const seconds = parseInt(parts[TimeUnit.SECONDS.valueOf()]);
		let currentValue;

		switch (timeUnit) {
			case TimeUnit.HOURS:
				currentValue = hours;
				break;
			case TimeUnit.MINUTES:
				currentValue = minutes;
				break;
			case TimeUnit.SECONDS:
				currentValue = seconds;
				break;
		}
		return {
			hours: hours,
			minutes: minutes,
			seconds: seconds,
			currentValue: currentValue,
		};
	};

	const fetchNewValuesOnRemoval = (
		hours: number,
		minutes: number,
		seconds: number,
		newValue: number | null,
		timeUnit: TimeUnit,
	) => {
		if (newValue !== null) {
			switch (timeUnit) {
				case TimeUnit.HOURS:
					return {
						tempHours: newValue,
						tempMinutes: minutes,
						tempSeconds: seconds,
					};
				case TimeUnit.MINUTES:
					return {
						tempHours: hours,
						tempMinutes: newValue,
						tempSeconds: seconds,
					};
				case TimeUnit.SECONDS:
					return {
						tempHours: hours,
						tempMinutes: minutes,
						tempSeconds: newValue,
					};
			}
		}
	};

	return { doAdjustTimeInputOnRemoval };
};

export default useAdjustTimeInputOnRemoval;
