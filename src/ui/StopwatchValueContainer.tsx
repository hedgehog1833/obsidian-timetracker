import React, { useEffect, useRef, useState } from 'react';
import TimeInput from './TimeInput';
import Timetracker from '../main';

export type StopwachValueContainerProps = {
	stopwatchValue: string;
	setStopwatchValue: (milliseconds: number) => void;
	stopStopwatch: () => void;
	plugin: Timetracker;
};

const StopwachValueContainer = (props: StopwachValueContainerProps) => {
	const [isEditing, setIsEditing] = useState(false);
	const [hours, setHours] = useState<number>(0);
	const [minutes, setMinutes] = useState<number>(0);
	const [seconds, setSeconds] = useState<number>(0);
	const inputHoursRef = useRef<HTMLInputElement>(null);
	const inputMinutesRef = useRef<HTMLInputElement>(null);
	const inputSecondsRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (isEditing) {
			if (props.plugin.settings.showSeconds) {
				inputSecondsRef.current?.focus();
				inputSecondsRef.current?.setSelectionRange(0, 0);
			} else if (props.plugin.settings.showMinutes) {
				inputMinutesRef.current?.focus();
				inputMinutesRef.current?.setSelectionRange(0, 0);
			} else if (props.plugin.settings.showHours) {
				inputHoursRef.current?.focus();
				inputHoursRef.current?.setSelectionRange(0, 0);
			}
		}
	}, [isEditing]);

	const handleOnButtonClick = () => {
		if (!isEditing) {
			props.stopStopwatch();
			setIsEditing(true);
			initializeTimeValues();
		} else {
			setIsEditing(false);
		}
	};

	const initializeTimeValues = () => {
		const valueParts = props.stopwatchValue.split(':');
		setHours(parseInt(valueParts[0]));
		setMinutes(parseInt(valueParts[1]));
		setSeconds(parseInt(valueParts[2]));
	};

	const handleOnHoursChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const hours = parseInt(prepareValue(event));
		if (hours > 99) {
			return;
		}

		setValue(hours, minutes, seconds);
		setHours(hours);
	};

	const handleOnMinutesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const minutes = parseInt(prepareValue(event));
		if (minutes > 59) {
			return;
		}

		setValue(hours, minutes, seconds);
		setMinutes(minutes);
	};

	const handleOnSecondsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const seconds = parseInt(prepareValue(event));
		if (seconds > 59) {
			return;
		}

		setValue(hours, minutes, seconds);
		setSeconds(seconds);
	};

	const prepareValue = (event: React.ChangeEvent<HTMLInputElement>): string => {
		const cursorPosition = event.target.selectionStart;
		let value = event.target.value;
		if (cursorPosition) {
			if (cursorPosition === 1 || cursorPosition === 3) {
				return value.slice(0, 1) + value.slice(2);
			} else if (cursorPosition === 2) {
				return value.slice(0, -1);
			}
		}
		return value;
	};

	const setValue = (hours: number, minutes: number, seconds: number) => {
		const date = new Date();
		date.setHours(date.getHours() - hours, date.getMinutes() - minutes, date.getSeconds() - seconds);
		props.setStopwatchValue(date.getTime());
	};

	const prepareStopwatchValue = (value: string): string => {
		if (props.plugin.settings.trimLeadingZeros && value.startsWith('0')) {
			return value.slice(1);
		}
		return value;
	};

	return (
		<div className="stopwatch-value-wrapper">
			<div className="stopwatch-value-container">
				{props.plugin.settings.showHours && (
					<TimeInput
						stopwatchValue={prepareStopwatchValue(props.stopwatchValue.split(':')[0])}
						isEditing={isEditing}
						onChangeHandler={handleOnHoursChange}
						focusRef={inputHoursRef}
					/>
				)}
				{props.plugin.settings.showHours && props.plugin.settings.showMinutes && <p>:</p>}
				{props.plugin.settings.showMinutes && (
					<TimeInput
						stopwatchValue={prepareStopwatchValue(props.stopwatchValue.split(':')[1])}
						isEditing={isEditing}
						onChangeHandler={handleOnMinutesChange}
						focusRef={inputMinutesRef}
					/>
				)}
				{((props.plugin.settings.showHours && !props.plugin.settings.showMinutes) ||
					props.plugin.settings.showMinutes) &&
					props.plugin.settings.showSeconds && <p>:</p>}
				{props.plugin.settings.showSeconds && (
					<TimeInput
						stopwatchValue={prepareStopwatchValue(props.stopwatchValue.split(':')[2])}
						isEditing={isEditing}
						onChangeHandler={handleOnSecondsChange}
						focusRef={inputSecondsRef}
					/>
				)}
			</div>

			<button className="stopwatch-function-button" onClick={handleOnButtonClick}>
				{isEditing ? 'Return' : 'Set'}
			</button>
		</div>
	);
};

export default StopwachValueContainer;
