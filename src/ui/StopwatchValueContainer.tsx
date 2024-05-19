import React, { useState } from 'react';

export type StopwachValueContainerProps = {
	stopwatchValue: string;
	setStopwatchValue: (milliseconds: number) => void;
	format: string;
};

const StopwachValueContainer = (props: StopwachValueContainerProps) => {
	const [isEditing, setIsEditing] = useState(false);

	const handleOnButtonClick = () => {
		setIsEditing(!isEditing);
	};

	const handleOnChange = (newValue: string) => {
		// const regex = /^\d+:\d+:\d+$/;
		// if (!regex.test(newValue)) {
		// 	return;
		// }

		const valueParts = newValue.split(':').map((part) => part.padStart(2, '0'));
		const hours = parseInt(valueParts[0]);
		const minutes = parseInt(valueParts[1]);
		const seconds = parseInt(valueParts[2]);

		if (hours < 0 || hours > 23) {
			return;
		}
		if (minutes < 0 || minutes > 59) {
			return;
		}
		if (seconds < 0 || seconds > 59) {
			return;
		}

		const date = new Date();
		date.setHours(date.getHours() - hours, date.getMinutes() - minutes, date.getSeconds() - seconds);
		props.setStopwatchValue(date.getTime());
	};

	const handleOnBlur = () => {
		setIsEditing(false);
	};

	return (
		<div className="stopwatch-value-container">
			<input
				type="text"
				disabled={!isEditing}
				className="stopwatch-value-input custom-input"
				value={props.stopwatchValue}
				onChange={(event) => handleOnChange(event.target.value)}
				onBlur={() => handleOnBlur()}
			/>

			<button className="edit-button" onClick={handleOnButtonClick}>
				{isEditing ? 'Return' : 'Set'}
			</button>
		</div>
	);
};

export default StopwachValueContainer;
