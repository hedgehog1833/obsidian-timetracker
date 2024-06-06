import React, { useEffect, useRef, useState } from 'react';
import TimeInput from './TimeInput';

export type StopwachValueContainerProps = {
	stopwatchValue: string;
	setStopwatchValue: (milliseconds: number) => void;
	stopStopwatch: () => void;
};

const StopwachValueContainer = (props: StopwachValueContainerProps) => {
	const [isEditing, setIsEditing] = useState(false);
	const [hours, setHours] = useState<number>(0);
	const [minutes, setMinutes] = useState<number>(0);
	const [seconds, setSeconds] = useState<number>(0);
	const inputSecondsRef = useRef<HTMLInputElement>(null);

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

		const date = new Date();
		date.setHours(date.getHours() - hours, date.getMinutes() - minutes, date.getSeconds() - seconds);
		props.setStopwatchValue(date.getTime());
		setHours(hours);
	};

	const handleOnMinutesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		let minutes = parseInt(event.target.value);

		if (minutes > 59) {
			minutes = 0;
		}

		const date = new Date();
		date.setHours(date.getHours() - hours, date.getMinutes() - minutes, date.getSeconds() - seconds);
		props.setStopwatchValue(date.getTime());
		setMinutes(minutes);
	};

	const handleOnSecondsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		let seconds = parseInt(event.target.value);

		if (seconds > 59) {
			seconds = 0;
		}

		const date = new Date();
		date.setHours(date.getHours() - hours, date.getMinutes() - minutes, date.getSeconds() - seconds);
		props.setStopwatchValue(date.getTime());
		setSeconds(seconds);
	};

	// const setValue = (hours: number, seconds: number, minutes: number) => {
	// 	const date = new Date();
	// 	date.setHours(date.getHours() - hours, date.getMinutes() - minutes, date.getSeconds() - seconds);
	// 	props.setStopwatchValue(date.getTime());
	// };

	return (
		<div className="stopwatch-value-wrapper">
			<div className="stopwatch-value-container">
				<TimeInput
					stopwatchValue={props.stopwatchValue.split(':')[0]}
					isEditing={isEditing}
					onChangeHandler={handleOnHoursChange}
				/>
				<p>:</p>
				<TimeInput
					stopwatchValue={props.stopwatchValue.split(':')[1]}
					isEditing={isEditing}
					onChangeHandler={handleOnMinutesChange}
				/>
				<p>:</p>
				<TimeInput
					stopwatchValue={props.stopwatchValue.split(':')[2]}
					isEditing={isEditing}
					onChangeHandler={handleOnSecondsChange}
					focusRef={inputSecondsRef}
				/>
			</div>

			<button className="stopwatch-function-button" onClick={handleOnButtonClick}>
				{isEditing ? 'Return' : 'Set'}
			</button>
		</div>
	);
};

export default StopwachValueContainer;
