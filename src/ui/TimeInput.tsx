import React, { useEffect, useState } from 'react';
import { TimetrackerSettings } from '../main';
import { TimeUnit } from './TimeUnit';

export type TimeInputProps = {
	timeUnit: TimeUnit;
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
		let value = parts[props.timeUnit.valueOf()];

		if (!props.isEditing && props.settings.trimLeadingZeros && value.startsWith('0')) {
			value = value.slice(1);
		}

		return satisfiesDefaultConditions(value) ||
			(props.timeUnit === TimeUnit.HOURS &&
				satisfiesHourConditions(parts[TimeUnit.MINUTES.valueOf()], parts[TimeUnit.SECONDS.valueOf()])) ||
			(props.timeUnit === TimeUnit.MINUTES &&
				satisfiesMinuteConditions(parts[TimeUnit.HOURS.valueOf()], parts[TimeUnit.SECONDS.valueOf()])) ||
			(props.timeUnit === TimeUnit.SECONDS &&
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

	const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setCursorPosition(event.target.selectionStart);
		const newValue = parseInt(adjustInput(event));
		const parts = props.stopwatchValue.split(':');
		let tempHours = parseInt(parts[TimeUnit.HOURS.valueOf()]);
		let tempMinutes = parseInt(parts[TimeUnit.MINUTES.valueOf()]);
		let tempSeconds = parseInt(parts[TimeUnit.SECONDS.valueOf()]);

		switch (props.timeUnit) {
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

		setStopwatchValue(tempHours, tempMinutes, tempSeconds);
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

	const setStopwatchValue = (hours: number, minutes: number, seconds: number) => {
		const date = new Date();
		date.setHours(date.getHours() - hours, date.getMinutes() - minutes, date.getSeconds() - seconds);
		props.setStopwatchValue(date.getTime());
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Backspace' || event.key === 'Delete') {
			handleRemoval(event);
		}
	};

	const handleRemoval = (event: React.KeyboardEvent<HTMLInputElement>) => {
		event.preventDefault();
		const cursorPosition = props.focusRef.current?.selectionStart;

		if (cursorPosition != null) {
			setCursorPosition(cursorPosition + 1);
			const stopwatchValues = fetchStopwatchValues();
			const newValue = buildNewValueOnRemoval(event, stopwatchValues.currentValue, cursorPosition);
			setStopwatchValueOnRemoval(stopwatchValues.hours, stopwatchValues.minutes, stopwatchValues.seconds, newValue);
		}
	};

	const buildNewValueOnRemoval = (
		event: React.KeyboardEvent<HTMLInputElement>,
		currentValue: number,
		cursorPosition: number,
	) => {
		let newValue = null;
		if ((cursorPosition === 0 && event.key === 'Delete') || (cursorPosition === 1 && event.key === 'Backspace')) {
			newValue = parseInt(currentValue.toString().substring(1)) || 0;
		} else if (
			(cursorPosition === 1 && event.key === 'Delete') ||
			(cursorPosition === 2 && event.key === 'Backspace')
		) {
			newValue = parseInt(currentValue.toString().slice(0, -1)) || 0;
		}
		return newValue;
	};

	const fetchStopwatchValues = () => {
		const parts = props.stopwatchValue.split(':');
		const hours = parseInt(parts[TimeUnit.HOURS.valueOf()]);
		const minutes = parseInt(parts[TimeUnit.MINUTES.valueOf()]);
		const seconds = parseInt(parts[TimeUnit.SECONDS.valueOf()]);
		let currentValue;

		switch (props.timeUnit) {
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

	const setStopwatchValueOnRemoval = (hours: number, minutes: number, seconds: number, newValue: number | null) => {
		if (newValue != null) {
			switch (props.timeUnit) {
				case TimeUnit.HOURS:
					setStopwatchValue(newValue, minutes, seconds);
					break;
				case TimeUnit.MINUTES:
					setStopwatchValue(hours, newValue, seconds);
					break;
				case TimeUnit.SECONDS:
					setStopwatchValue(hours, minutes, newValue);
					break;
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
				onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleTimeChange(event)}
				onFocus={onFocusHandler}
				onKeyDown={handleKeyDown}
			/>
		</>
	);
};

export default TimeInput;
