import React from 'react';
import { TimeUnit } from '../timeUnit';

const useAdjustTimeInputOnChange = () => {
	const doAdjustTimeInputOnChange = (
		event: React.ChangeEvent<HTMLInputElement>,
		stopwatchValue: string,
		timeUnit: TimeUnit,
	) => {
		const newValue = parseInt(adjustInput(event));
		const parts = stopwatchValue.split(':');
		let tempHours = parseInt(parts[TimeUnit.HOURS.valueOf()]);
		let tempMinutes = parseInt(parts[TimeUnit.MINUTES.valueOf()]);
		let tempSeconds = parseInt(parts[TimeUnit.SECONDS.valueOf()]);

		switch (timeUnit) {
			case TimeUnit.HOURS:
				if (newValue > 99) {
					return;
				}
				tempHours = newValue;
				break;
			case TimeUnit.MINUTES:
				if (newValue > 59) {
					return;
				}
				tempMinutes = newValue;
				break;
			case TimeUnit.SECONDS:
				if (newValue > 59) {
					return;
				}
				tempSeconds = newValue;
				break;
		}

		return {
			tempHours: tempHours,
			tempMinutes: tempMinutes,
			tempSeconds: tempSeconds,
		};
	};

	const adjustInput = (event: React.ChangeEvent<HTMLInputElement>): string => {
		const cursorPosition = event.target.selectionStart;
		let value = event.target.value;
		if (cursorPosition === 1) {
			return value.slice(0, 1) + value.slice(2);
		} else if (cursorPosition === 2) {
			return value.slice(0, -1);
		}
		return value;
	};

	return { doAdjustTimeInputOnChange };
};

export default useAdjustTimeInputOnChange;
