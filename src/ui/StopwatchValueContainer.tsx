import React, { useEffect, useRef, useState } from 'react';
import TimeInput from './TimeInput';
import Timetracker from '../main';

export type StopwachValueContainerProps = {
	stopwatchValue: string;
	setStopwatchValue: (milliseconds: number) => void;
	stopStopwatch: () => void;
	plugin: Timetracker;
};

const StopwachValueContainer = (props: StopwachValueContainerProps) => {
	const [isEditing, setIsEditing] = useState(false);
	const [hours, setHours] = useState<number>(0);
	const [minutes, setMinutes] = useState<number>(0);
	const [seconds, setSeconds] = useState<number>(0);
	const inputHoursRef = useRef<HTMLInputElement>(null);
	const inputMinutesRef = useRef<HTMLInputElement>(null);
	const inputSecondsRef = useRef<HTMLInputElement>(null);
	const stopwatchValueWrapperRef = useRef<HTMLDivElement>(null);
	const separatorElement = <p className={'separator'}>:</p>;

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (stopwatchValueWrapperRef.current && !stopwatchValueWrapperRef.current.contains(event.target as Node)) {
				setIsEditing(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [stopwatchValueWrapperRef.current]);

	useEffect(() => {
		if (isEditing) {
			if (props.plugin.settings.showSeconds) {
				inputSecondsRef.current?.focus();
				inputSecondsRef.current?.setSelectionRange(0, 0);
			} else if (props.plugin.settings.showMinutes) {
				inputMinutesRef.current?.focus();
				inputMinutesRef.current?.setSelectionRange(0, 0);
			} else if (props.plugin.settings.showHours) {
				inputHoursRef.current?.focus();
				inputHoursRef.current?.setSelectionRange(0, 0);
			}
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
		const hours = parseInt(adjustInput(event));
		if (hours > 99) {
			return;
		}

		setStopwatchValue(hours, minutes, seconds);
		setHours(hours);
	};

	const handleOnMinutesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const minutes = parseInt(adjustInput(event));
		if (minutes > 59) {
			return;
		}

		setStopwatchValue(hours, minutes, seconds);
		setMinutes(minutes);
	};

	const handleOnSecondsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const seconds = parseInt(adjustInput(event));
		if (seconds > 59) {
			return;
		}

		setStopwatchValue(hours, minutes, seconds);
		setSeconds(seconds);
	};

	const adjustInput = (event: React.ChangeEvent<HTMLInputElement>): string => {
		const cursorPosition = event.target.selectionStart;
		let value = event.target.value;
		if (cursorPosition) {
			if (cursorPosition === 1 || cursorPosition === 3) {
				return value.slice(0, 1) + value.slice(2);
			} else if (cursorPosition === 2) {
				return value.slice(0, -1);
			}
		}
		return value;
	};

	const setStopwatchValue = (hours: number, minutes: number, seconds: number) => {
		const date = new Date();
		date.setHours(date.getHours() - hours, date.getMinutes() - minutes, date.getSeconds() - seconds);
		props.setStopwatchValue(date.getTime());
	};

	const formatHourValue = (): string => {
		const tempMinutes = props.stopwatchValue.split(':')[1];
		const tempSeconds = props.stopwatchValue.split(':')[2];
		let value = props.stopwatchValue.split(':')[0];
		if (!isEditing && props.plugin.settings.trimLeadingZeros && value.startsWith('0')) {
			value = value.slice(1);
		}
		return (value !== '0' && value !== '00') ||
			isEditing ||
			((value === '0' || value === '00') &&
				!props.plugin.settings.showMinutes &&
				!props.plugin.settings.showSeconds &&
				(parseInt(tempSeconds) > 0 || parseInt(tempMinutes) > 0))
			? value
			: '';
	};

	const formatMinuteValue = (): string => {
		const tempHours = props.stopwatchValue.split(':')[0];
		const tempSeconds = props.stopwatchValue.split(':')[2];
		let value = props.stopwatchValue.split(':')[1];
		if (!isEditing && props.plugin.settings.trimLeadingZeros && value.startsWith('0')) {
			value = value.slice(1);
		}
		return (value !== '0' && value !== '00') ||
			isEditing ||
			parseInt(tempHours) > 0 ||
			((value === '0' || value === '00') &&
				!props.plugin.settings.showSeconds &&
				parseInt(tempHours) == 0 &&
				parseInt(tempSeconds) > 0)
			? value
			: '';
	};

	const formatSecondValue = (): string => {
		const tempHours = props.stopwatchValue.split(':')[0];
		const tempMinutes = props.stopwatchValue.split(':')[1];
		let value = props.stopwatchValue.split(':')[2];
		if (!isEditing && props.plugin.settings.trimLeadingZeros && value.startsWith('0')) {
			value = value.slice(1);
		}
		return (value !== '0' && value !== '00') || isEditing || parseInt(tempHours) > 0 || parseInt(tempMinutes) > 0
			? value
			: '';
	};

	return (
		<div ref={stopwatchValueWrapperRef} className="stopwatch-value-wrapper">
			<div className="stopwatch-value-container">
				{props.plugin.settings.showHours && (
					<TimeInput
						stopwatchValue={formatHourValue()}
						isEditing={isEditing}
						onChangeHandler={handleOnHoursChange}
						focusRef={inputHoursRef}
						trimLeadingZeros={props.plugin.settings.trimLeadingZeros}
					/>
				)}
				{props.plugin.settings.showHours && props.plugin.settings.showMinutes && separatorElement}
				{props.plugin.settings.showMinutes && (
					<TimeInput
						stopwatchValue={formatMinuteValue()}
						isEditing={isEditing}
						onChangeHandler={handleOnMinutesChange}
						focusRef={inputMinutesRef}
						trimLeadingZeros={props.plugin.settings.trimLeadingZeros}
					/>
				)}
				{((props.plugin.settings.showHours && !props.plugin.settings.showMinutes) ||
					props.plugin.settings.showMinutes) &&
					props.plugin.settings.showSeconds &&
					separatorElement}
				{props.plugin.settings.showSeconds && (
					<TimeInput
						stopwatchValue={formatSecondValue()}
						isEditing={isEditing}
						onChangeHandler={handleOnSecondsChange}
						focusRef={inputSecondsRef}
						trimLeadingZeros={props.plugin.settings.trimLeadingZeros}
					/>
				)}
			</div>

			<button className="stopwatch-function-button" onClick={handleOnButtonClick}>
				{isEditing ? 'Return' : 'Set'}
			</button>
		</div>
	);
};

export default StopwachValueContainer;
