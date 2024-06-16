import React, { useEffect, useState } from 'react';

export type TimeInputProps = {
	stopwatchValue: string;
	isEditing: boolean;
	onChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
	focusRef: React.RefObject<HTMLInputElement>;
};

const TimeInput = (props: TimeInputProps) => {
	const [cursorPosition, setCursorPosition] = useState<number | null>(null);

	useEffect(() => {
		if (props.focusRef.current) {
			props.focusRef.current.setSelectionRange(cursorPosition, cursorPosition);
		}
	}, [cursorPosition]);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target?.selectionStart) {
			setCursorPosition(event.target.selectionStart);
			props.onChangeHandler(event);
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
				value={props.stopwatchValue}
				onChange={handleChange}
			/>
		</>
	);
};

export default TimeInput;
