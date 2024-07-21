import React, { useEffect, useState } from 'react';
import { TimetrackerSettings } from '../main';
import { TimeUnit } from './TimeUnit';

export type TimeInputProps = {
	timeUnitType: TimeUnit;
	settings: TimetrackerSettings;
	stopwatchValue: string;
	isEditing: boolean;
	focusRef: React.RefObject<HTMLInputElement>;
	setStopwatchValue: (milliseconds: number) => void;
};

const TimeInput = (props: TimeInputProps) => {
	const [cursorPosition, setCursorPosition] = useState<number | null>(null);

	useEffect(() => {
		if (props.focusRef.current) {
			props.focusRef.current.setSelectionRange(cursorPosition, cursorPosition);
		}
	}, [cursorPosition]);

	const onFocusHandler = () => {
		props.focusRef.current?.setSelectionRange(0, 0);
	};

	const formatTimeUnitValue = (): string => {
		const parts = props.stopwatchValue.split(':');
		let value = parts[props.timeUnitType.valueOf()];

		if (!props.isEditing && props.settings.trimLeadingZeros && value.startsWith('0')) {
			value = value.slice(1);
		}

		return satisfiesDefaultConditions(value) ||
			(props.timeUnitType === TimeUnit.HOURS &&
				satisfiesHourConditions(parts[TimeUnit.MINUTES.valueOf()], parts[TimeUnit.SECONDS.valueOf()])) ||
			(props.timeUnitType === TimeUnit.MINUTES &&
				satisfiesMinuteConditions(parts[TimeUnit.HOURS.valueOf()], parts[TimeUnit.SECONDS.valueOf()])) ||
			(props.timeUnitType === TimeUnit.SECONDS &&
				satisfiesSecondsConditions(parts[TimeUnit.HOURS], parts[TimeUnit.MINUTES.valueOf()]))
			? value
			: '';
	};

	const satisfiesHourConditions = (minutes: string, seconds: string): boolean => {
		return (
			!props.settings.showMinutes && !props.settings.showSeconds && (parseInt(minutes) > 0 || parseInt(seconds) > 0)
		);
	};

	const satisfiesMinuteConditions = (hours: string, seconds: string): boolean => {
		return parseInt(hours) > 0 || (!props.settings.showSeconds && parseInt(seconds) > 0);
	};

	const satisfiesSecondsConditions = (hours: string, minutes: string): boolean => {
		return parseInt(hours) > 0 || parseInt(minutes) > 0;
	};

	const satisfiesDefaultConditions = (value: string): boolean => {
		return (value !== '0' && value !== '00') || props.isEditing;
	};

	const handleTimeChange = (unit: TimeUnit, event: React.ChangeEvent<HTMLInputElement>) => {
		setCursorPosition(event.target.selectionStart);
		const newValue = parseInt(adjustInput(event));
		const parts = props.stopwatchValue.split(':');
		let tempHours = parseInt(parts[TimeUnit.HOURS.valueOf()]);
		let tempMinutes = parseInt(parts[TimeUnit.MINUTES.valueOf()]);
		let tempSeconds = parseInt(parts[TimeUnit.SECONDS.valueOf()]);

		switch (unit) {
			case TimeUnit.HOURS:
				if (newValue > 99) return;
				tempHours = newValue;
				break;
			case TimeUnit.MINUTES:
				if (newValue > 59) return;
				tempMinutes = newValue;
				break;
			case TimeUnit.SECONDS:
				if (newValue > 59) return;
				tempSeconds = newValue;
				break;
		}

		setStopwatchValue(tempHours, tempMinutes, tempSeconds);
	};

	const adjustInput = (event: React.ChangeEvent<HTMLInputElement>): string => {
		const cursorPosition = event.target.selectionStart;
		let value = event.target.value;
		if (cursorPosition) {
			if (cursorPosition === 1) {
				return value.slice(0, 1) + value.slice(2);
			} else if (cursorPosition === 2) {
				return value.slice(0, -1);
			}
		}
		return value;
	};

	const setStopwatchValue = (hours: number, minutes: number, seconds: number) => {
		const date = new Date();
		date.setHours(date.getHours() - hours, date.getMinutes() - minutes, date.getSeconds() - seconds);
		props.setStopwatchValue(date.getTime());
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Backspace') {
			handleBackspace(event);
		} else if (event.key === 'Delete') {
			handleDelete(event);
		}
	};

	const handleBackspace = (event: React.KeyboardEvent<HTMLInputElement>) => {
		event.preventDefault();
		const cursorPosition = props.focusRef.current?.selectionStart;
		if (cursorPosition) {
			const parts = props.stopwatchValue.split(':');
			const tempHours = parseInt(parts[TimeUnit.HOURS.valueOf()]);
			const tempMinutes = parseInt(parts[TimeUnit.MINUTES.valueOf()]);
			const tempSeconds = parseInt(parts[TimeUnit.SECONDS.valueOf()]);
			let value;

			switch (props.timeUnitType) {
				case TimeUnit.HOURS:
					value = tempHours;
					break;
				case TimeUnit.MINUTES:
					value = tempMinutes;
					break;
				case TimeUnit.SECONDS:
					value = tempSeconds;
					break;
			}
			if (value != null) {
				let tempValue = null;
				if (cursorPosition === 1) {
					tempValue = parseInt(value.toString().substring(1)) || 0;
				} else if (cursorPosition === 2) {
					tempValue = parseInt(value.toString().slice(0, -1)) || 0;
				}

				if (tempValue != null) {
					switch (props.timeUnitType) {
						case TimeUnit.HOURS:
							setStopwatchValue(tempValue, tempMinutes, tempSeconds);
							break;
						case TimeUnit.MINUTES:
							setStopwatchValue(tempHours, tempValue, tempSeconds);
							break;
						case TimeUnit.SECONDS:
							setStopwatchValue(tempHours, tempMinutes, tempValue);
							break;
					}
				}
			}
		}
	};

	const handleDelete = (event: React.KeyboardEvent<HTMLInputElement>) => {
		event.preventDefault();
		const cursorPosition = props.focusRef.current?.selectionStart;
		if (cursorPosition != null) {
			const parts = props.stopwatchValue.split(':');
			const tempHours = parseInt(parts[TimeUnit.HOURS.valueOf()]);
			const tempMinutes = parseInt(parts[TimeUnit.MINUTES.valueOf()]);
			const tempSeconds = parseInt(parts[TimeUnit.SECONDS.valueOf()]);
			let value;

			switch (props.timeUnitType) {
				case TimeUnit.HOURS:
					value = tempHours;
					break;
				case TimeUnit.MINUTES:
					value = tempMinutes;
					break;
				case TimeUnit.SECONDS:
					value = tempSeconds;
					break;
			}
			if (value != null) {
				let tempValue = null;
				if (cursorPosition === 0) {
					tempValue = parseInt(value.toString().substring(1)) || 0;
				} else if (cursorPosition === 1) {
					tempValue = parseInt(value.toString().slice(0, -1)) || 0;
				}

				if (tempValue != null) {
					switch (props.timeUnitType) {
						case TimeUnit.HOURS:
							setStopwatchValue(tempValue, tempMinutes, tempSeconds);
							break;
						case TimeUnit.MINUTES:
							setStopwatchValue(tempHours, tempValue, tempSeconds);
							break;
						case TimeUnit.SECONDS:
							setStopwatchValue(tempHours, tempMinutes, tempValue);
							break;
					}
				}
			}
		}
	};

	return (
		<>
			<input
				ref={props.focusRef}
				type="text"
				pattern="^\d{0,2}$"
				disabled={!props.isEditing}
				className="stopwatch-value-input"
				value={formatTimeUnitValue()}
				placeholder={props.settings.trimLeadingZeros ? '0' : '00'}
				onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleTimeChange(props.timeUnitType, event)}
				onFocus={onFocusHandler}
				onKeyDown={handleKeyDown}
			/>
		</>
	);
};

export default TimeInput;
