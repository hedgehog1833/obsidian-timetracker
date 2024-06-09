import React, { useEffect, useRef, useState } from 'react';
import TimeInput, { TimeInputCategory } from './TimeInput';
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
	const inputSecondsRef = useRef<HTMLInputElement>(null);
	const showHours = props.plugin.settings.format.contains('H') || props.plugin.settings.format.contains('h');
	const showMinutes = props.plugin.settings.format.contains('M') || props.plugin.settings.format.contains('m');
	const showSeconds = props.plugin.settings.format.contains('S') || props.plugin.settings.format.contains('s');

	useEffect(() => {
		if (isEditing) {
			inputSecondsRef.current?.focus();
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
		let hours = parseInt(event.target.value);

		if (hours > 99) {
			hours = 0;
		}

		setValue(hours, minutes, seconds);
		setHours(hours);
	};

	const handleOnMinutesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		let minutes = parseInt(event.target.value);

		if (minutes > 59) {
			minutes = 0;
		}

		setValue(hours, minutes, seconds);
		setMinutes(minutes);
	};

	const handleOnSecondsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		let seconds = parseInt(event.target.value);

		if (seconds > 59) {
			seconds = 0;
		}

		setValue(hours, minutes, seconds);
		setSeconds(seconds);
	};

	const setValue = (hours: number, minutes: number, seconds: number) => {
		const date = new Date();
		date.setHours(date.getHours() - hours, date.getMinutes() - minutes, date.getSeconds() - seconds);
		props.setStopwatchValue(date.getTime());
	};

	return (
		<div className="stopwatch-value-wrapper">
			<div className="stopwatch-value-container">
				{showHours && (
					<TimeInput
						stopwatchValue={props.stopwatchValue.split(':')[0]}
						isEditing={isEditing}
						onChangeHandler={handleOnHoursChange}
						category={TimeInputCategory.HOURS}
					/>
				)}
				{showHours && showMinutes && <p>:</p>}
				{showMinutes && (
					<TimeInput
						stopwatchValue={props.stopwatchValue.split(':')[1]}
						isEditing={isEditing}
						onChangeHandler={handleOnMinutesChange}
						category={TimeInputCategory.MINUTES}
					/>
				)}
				{((showHours && !showMinutes) || showMinutes) && showSeconds && <p>:</p>}
				{showSeconds && (
					<TimeInput
						stopwatchValue={props.stopwatchValue.split(':')[2]}
						isEditing={isEditing}
						onChangeHandler={handleOnSecondsChange}
						focusRef={inputSecondsRef}
						category={TimeInputCategory.SECONDS}
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
