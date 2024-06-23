import React, { useEffect, useState } from 'react';

export type TimeInputProps = {
	stopwatchValue: string;
	isEditing: boolean;
	onChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
	focusRef: React.RefObject<HTMLInputElement>;
	trimLeadingZeros: boolean;
	onKeyDownHandler: (event: React.KeyboardEvent<HTMLInputElement>) => void;
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

	const onFocusHandler = () => {
		props.focusRef.current?.setSelectionRange(0, 0);
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
				placeholder={props.trimLeadingZeros ? '0' : '00'}
				onFocus={onFocusHandler}
				onKeyDown={props.onKeyDownHandler}
			/>
		</>
	);
};

export default TimeInput;
