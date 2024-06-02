import React, { useEffect, useRef, useState } from 'react';

export type StopwachValueContainerProps = {
	stopwatchValue: string;
	setStopwatchValue: (milliseconds: number) => void;
	stopStopwatch: () => void;
};

const StopwachValueContainer = (props: StopwachValueContainerProps) => {
	const TWO_DIGITS_REGEX = /^\d{0,2}$/;
	const [isEditing, setIsEditing] = useState(false);
	const [hours, setHours] = useState<number>(0);
	const [minutes, setMinutes] = useState<number>(0);
	const [seconds, setSeconds] = useState<number>(0);
	const inputHoursRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (isEditing) {
			inputHoursRef.current?.focus();
		}
	}, [isEditing]);

	const handleOnButtonClick = () => {
		if (isEditing) {
			setIsEditing(false);
		} else {
			props.stopStopwatch();
			setIsEditing(true);
			initializeTimeValues();
		}
	};

	const initializeTimeValues = () => {
		const valueParts = props.stopwatchValue.split(':');
		setHours(parseInt(valueParts[0]));
		setMinutes(parseInt(valueParts[1]));
		setSeconds(parseInt(valueParts[2]));
	};

	const handleOnHoursChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const hours = prepareValue(event.target.value);

		if (!hours || hours < 0 || hours > 23) {
			return;
		}

		const date = new Date();
		date.setHours(date.getHours() - hours, date.getMinutes() - minutes, date.getSeconds() - seconds);
		props.setStopwatchValue(date.getTime());
	};

	const handleOnMinutesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const minutes = prepareValue(event.target.value);

		if (!minutes || minutes < 0 || minutes > 59) {
			return;
		}

		const date = new Date();
		date.setHours(date.getHours() - hours, date.getMinutes() - minutes, date.getSeconds() - seconds);
		props.setStopwatchValue(date.getTime());
	};

	const handleOnSecondsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const seconds = prepareValue(event.target.value);

		if (!seconds || seconds < 0 || seconds > 59) {
			return;
		}

		const date = new Date();
		date.setHours(date.getHours() - hours, date.getMinutes() - minutes, date.getSeconds() - seconds);
		props.setStopwatchValue(date.getTime());
	};

	const prepareValue = (newValue: string): null | number => {
		const secondsString = createTimeString(newValue);

		if (!secondsString) {
			return null;
		}

		return parseInt(secondsString);
	};

	const createTimeString = (timeString: string): string | null => {
		if (timeString && !TWO_DIGITS_REGEX.test(timeString)) {
			if (isNaN(parseInt(timeString)) || timeString.length <= 2) {
				return null;
			} else {
				return timeString.slice(0, -1);
			}
		}
		return timeString;
	};

	return (
		<div className="stopwatch-value-container">
			<input
				ref={inputHoursRef}
				type="text"
				disabled={!isEditing}
				className="stopwatch-value-input"
				value={props.stopwatchValue.split(':')[0]}
				onChange={handleOnHoursChange}
			/>
			<p>:</p>
			<input
				type="text"
				disabled={!isEditing}
				className="stopwatch-value-input"
				value={props.stopwatchValue.split(':')[1]}
				onChange={handleOnMinutesChange}
			/>
			<p>:</p>
			<input
				type="text"
				disabled={!isEditing}
				className="stopwatch-value-input"
				value={props.stopwatchValue.split(':')[2]}
				onChange={handleOnSecondsChange}
			/>

			<button className="edit-button" onClick={handleOnButtonClick}>
				{isEditing ? 'Return' : 'Set'}
			</button>
		</div>
	);
};

export default StopwachValueContainer;
