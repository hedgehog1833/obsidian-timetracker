import React, { useEffect, useRef, useState } from 'react';

export type StopwachValueContainerProps = {
	stopwatchValue: string;
	setStopwatchValue: (milliseconds: number) => void;
	stopStopwatch: () => void;
	format: string;
};

const StopwachValueContainer = (props: StopwachValueContainerProps) => {
	const TWO_DIGITS_REGEX = /^\d{0,2}$/;
	const [isEditing, setIsEditing] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (isEditing) {
			inputRef.current?.focus();
		}
	}, [isEditing]);

	const handleOnButtonClick = () => {
		if (!isEditing) {
			props.stopStopwatch();
		}
		setIsEditing(!isEditing);
	};

	const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.value;
		const cursorPosition = event.target.selectionStart;

		const valueParts = newValue.split(':');
		const hoursString = createTimeString(valueParts[0]);
		const minutesString = createTimeString(valueParts[1]);
		const secondsString = createTimeString(valueParts[2]);

		if (!(hoursString && minutesString && secondsString)) {
			return;
		}

		const hours = parseInt(hoursString);
		const minutes = parseInt(minutesString);
		const seconds = parseInt(secondsString);

		if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) {
			return;
		}

		const date = new Date();
		date.setHours(date.getHours() - hours, date.getMinutes() - minutes, date.getSeconds() - seconds);
		props.setStopwatchValue(date.getTime());

		if (cursorPosition !== undefined) {
			event.target.setSelectionRange(cursorPosition, cursorPosition);
		}
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

	const handleOnBlur = () => {
		setIsEditing(false);
	};

	return (
		<div className="stopwatch-value-container">
			<input
				ref={inputRef}
				type="text"
				disabled={!isEditing}
				className="stopwatch-value-input custom-input"
				value={props.stopwatchValue}
				onChange={handleOnChange}
				onBlur={handleOnBlur}
			/>

			<button className="edit-button" onClick={handleOnButtonClick}>
				{isEditing ? 'Return' : 'Set'}
			</button>
		</div>
	);
};

export default StopwachValueContainer;
