import React, { useEffect, useState } from 'react';
import { TimetrackerSettings } from '../main';
import { TimeUnit } from './TimeUnit';

export type TimeInputProps = {
	timeUnitType: TimeUnit;
	settings: TimetrackerSettings;
	stopwatchValue: string;
	isEditing: boolean;
	focusRef: React.RefObject<HTMLInputElement>;
	onChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
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

	const formatTimeUnitValue = (): string => {
		const parts = props.stopwatchValue.split(':');
		let value = parts[props.timeUnitType.valueOf()];

		if (!props.isEditing && props.settings.trimLeadingZeros && value.startsWith('0')) {
			value = value.slice(1);
		}

		return satisfiesDefaultConditions(value) ||
			(props.timeUnitType === TimeUnit.HOURS &&
				satisfiesHourConditions(parts[TimeUnit.MINUTES.valueOf()], parts[TimeUnit.SECONDS.valueOf()])) ||
			(props.timeUnitType === TimeUnit.MINUTES &&
				satisfiesMinuteConditions(parts[TimeUnit.HOURS.valueOf()], parts[TimeUnit.SECONDS.valueOf()])) ||
			(props.timeUnitType === TimeUnit.SECONDS &&
				satisfiesSecondsConditions(parts[TimeUnit.HOURS], parts[TimeUnit.MINUTES.valueOf()]))
			? value
			: '';
	};

	const satisfiesHourConditions = (minutes: string, seconds: string): boolean => {
		return (
			!props.settings.showMinutes && !props.settings.showSeconds && (parseInt(minutes) > 0 || parseInt(seconds) > 0)
		);
	};

	const satisfiesMinuteConditions = (hours: string, seconds: string): boolean => {
		return parseInt(hours) > 0 || (!props.settings.showSeconds && parseInt(seconds) > 0);
	};

	const satisfiesSecondsConditions = (hours: string, minutes: string): boolean => {
		return parseInt(hours) > 0 || parseInt(minutes) > 0;
	};

	const satisfiesDefaultConditions = (value: string): boolean => {
		return (value !== '0' && value !== '00') || props.isEditing;
	};

	return (
		<>
			<input
				ref={props.focusRef}
				type="text"
				pattern="^\d{0,2}$"
				disabled={!props.isEditing}
				className="stopwatch-value-input"
				value={formatTimeUnitValue()}
				placeholder={props.settings.trimLeadingZeros ? '0' : '00'}
				onChange={handleChange}
				onFocus={onFocusHandler}
				onKeyDown={props.onKeyDownHandler}
			/>
		</>
	);
};

export default TimeInput;
