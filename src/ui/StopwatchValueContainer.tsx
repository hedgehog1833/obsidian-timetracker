import React, { useEffect, useRef, useState } from 'react';
import TimeInput from './TimeInput';
import { TimetrackerSettings } from '../main';
import { TimeUnit } from './timeUnit';

export type StopwatchValueContainerProps = {
	stopwatchValue: string;
	setStopwatchValue: (milliseconds: number) => void;
	stopStopwatch: () => void;
	settings: TimetrackerSettings;
};

const StopwatchValueContainer = (props: StopwatchValueContainerProps) => {
	const [isEditing, setIsEditing] = useState(false);
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
			if (props.settings.showSeconds) {
				inputSecondsRef.current?.focus();
			} else if (props.settings.showMinutes) {
				inputMinutesRef.current?.focus();
			} else if (props.settings.showHours) {
				inputHoursRef.current?.focus();
			}
		}
	}, [isEditing]);

	const handleOnButtonClick = () => {
		if (!isEditing) {
			props.stopStopwatch();
			setIsEditing(true);
		} else {
			setIsEditing(false);
		}
	};

	return (
		<div ref={stopwatchValueWrapperRef} className="stopwatch-value-wrapper" data-testid="stopwatch-value-container">
			<div className="stopwatch-value-container">
				{props.settings.showHours && (
					<TimeInput
						timeUnit={TimeUnit.HOURS}
						settings={props.settings}
						stopwatchValue={props.stopwatchValue}
						isEditing={isEditing}
						focusRef={inputHoursRef}
						setStopwatchValue={props.setStopwatchValue}
					/>
				)}
				{props.settings.showHours && props.settings.showMinutes && separatorElement}
				{props.settings.showMinutes && (
					<TimeInput
						timeUnit={TimeUnit.MINUTES}
						settings={props.settings}
						stopwatchValue={props.stopwatchValue}
						isEditing={isEditing}
						focusRef={inputMinutesRef}
						setStopwatchValue={props.setStopwatchValue}
					/>
				)}
				{((props.settings.showHours && !props.settings.showMinutes) || props.settings.showMinutes) &&
					props.settings.showSeconds &&
					separatorElement}
				{props.settings.showSeconds && (
					<TimeInput
						timeUnit={TimeUnit.SECONDS}
						settings={props.settings}
						stopwatchValue={props.stopwatchValue}
						isEditing={isEditing}
						focusRef={inputSecondsRef}
						setStopwatchValue={props.setStopwatchValue}
					/>
				)}
			</div>

			<button className="stopwatch-function-button" onClick={handleOnButtonClick}>
				{isEditing ? 'Return' : 'Set'}
			</button>
		</div>
	);
};

export default StopwatchValueContainer;
