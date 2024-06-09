import React from 'react';

export type TimeInputProps = {
	stopwatchValue: string;
	isEditing: boolean;
	onChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
	focusRef?: React.RefObject<HTMLInputElement>;
	category: TimeInputCategory;
};

export enum TimeInputCategory {
	HOURS,
	MINUTES,
	SECONDS,
}

const TimeInput = (props: TimeInputProps) => {
	return (
		<>
			<input
				ref={props.focusRef}
				type="text"
				pattern="^\d{0,2}$"
				disabled={!props.isEditing}
				className="stopwatch-value-input"
				value={props.stopwatchValue}
				onChange={props.onChangeHandler}
			/>
		</>
	);
};

export default TimeInput;
