import React, { useEffect, useState } from 'react';
import { TimetrackerSettings } from '../main';
import { TimeUnit } from './timeUnit';
import useFormatTimeValue from './hooks/useFormatTimeValue';
import useHandleTimeChange from './hooks/useHandleTimeChange';
import useHandleRemoval from './hooks/useHandleRemoval';

export type TimeInputProps = {
	timeUnit: TimeUnit;
	settings: TimetrackerSettings;
	stopwatchValue: string;
	isEditing: boolean;
	focusRef: React.RefObject<HTMLInputElement | null>;
	setStopwatchValue: (milliseconds: number) => void;
};

const TimeInput = (props: TimeInputProps) => {
	const [cursorPosition, setCursorPosition] = useState<number | null>(null);
	const { doFormatTimeValue } = useFormatTimeValue(props.settings);
	const { doHandleTimeChange } = useHandleTimeChange(props.setStopwatchValue);
	const { doHandleRemoval } = useHandleRemoval(props.focusRef, props.setStopwatchValue);

	useEffect(() => {
		if (props.focusRef.current) {
			props.focusRef.current.setSelectionRange(cursorPosition, cursorPosition);
		}
	}, [cursorPosition]);

	const handleFocus = () => {
		props.focusRef.current?.setSelectionRange(0, 0);
	};

	const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setCursorPosition(event.target.selectionStart);
		doHandleTimeChange(event, props.stopwatchValue, props.timeUnit);
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Backspace' || event.key === 'Delete') {
			event.preventDefault();
			const cursorPosition = props.focusRef.current?.selectionStart;

			if (cursorPosition != null) {
				setCursorPosition(cursorPosition + 1);
				doHandleRemoval(event, props.stopwatchValue, props.timeUnit);
			}
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
				value={doFormatTimeValue(props.stopwatchValue, props.timeUnit, props.isEditing)}
				placeholder={props.settings.trimLeadingZeros ? '0' : '00'}
				onChange={handleTimeChange}
				onFocus={handleFocus}
				onKeyDown={handleKeyDown}
			/>
		</>
	);
};

export default TimeInput;
