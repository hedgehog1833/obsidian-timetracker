import React from 'react';

export type TimeInputProps = {
	stopwatchValue: string;
	isEditing: boolean;
	onChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
	focusRef?: React.RefObject<HTMLInputElement>;
};

const TimeInput = (props: TimeInputProps) => {
	return (
		<>
			<input
				ref={props.focusRef}
				type="text"
				pattern="^\d{0,2}$"
				disabled={!props.isEditing}
				className="stopwatch-value-input"
				value={props.stopwatchValue.split(':')[0]}
				onChange={props.onChangeHandler}
			/>
		</>
	);
};

export default TimeInput;
