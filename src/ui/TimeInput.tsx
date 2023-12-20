import React, { useEffect, useState } from 'react';
import { Popover, ArrowContainer } from 'react-tiny-popover';

export type TimeInputProps = {
	setStopwatchValue: (milliseconds: number) => void;
	format: string;
};

const TimeInput = (props: TimeInputProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [hours, setHours] = useState<number | null>(null);
	const [minutes, setMinutes] = useState<number | null>(null);
	const [seconds, setSeconds] = useState<number | null>(null);
	const [refresh, setRefresh] = useState(false);

	useEffect(() => {
		if (hours != null || minutes != null || seconds != null) {
			const date = new Date();
			date.setHours(
				date.getHours() - (hours != null ? hours : 0),
				date.getMinutes() - (minutes != null ? minutes : 0),
				date.getSeconds() - (seconds != null ? seconds : 0),
			);
			props.setStopwatchValue(date.getTime());
		}
	}, [hours, minutes, seconds, refresh]);

	const handleClick = () => {
		setIsOpen(!isOpen);
	};

	const handleOnClickOutside = (event: MouseEvent) => {
		const target = event.target as HTMLElement;
		if (target.tagName === 'BUTTON') {
			event.stopPropagation();
		} else {
			setIsOpen(false);
			setHours(null);
			setMinutes(null);
			setSeconds(null);
		}
	};

	const handleHoursChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const inputHours = event.target.value === '' ? 0 : Number.parseInt(event.target.value);
		if (inputHours >= 0 && inputHours < 24) {
			setHours(inputHours);
		}
	};

	const handleMinutesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const inputMinutes = event.target.value === '' ? 0 : Number.parseInt(event.target.value);
		if (inputMinutes >= 0 && inputMinutes < 60) {
			setMinutes(inputMinutes);
		}
	};

	const handleSecondsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const inputSeconds = event.target.value === '' ? 0 : Number.parseInt(event.target.value);
		if (inputSeconds >= 0 && inputSeconds < 60) {
			setSeconds(inputSeconds);
		}
	};

	const handleSubmit = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key == 'Enter') {
			setRefresh(!refresh);
		}
	};

	return (
		<Popover
			isOpen={isOpen}
			positions={['bottom', 'left', 'right']}
			align="start"
			padding={18}
			onClickOutside={(event) => handleOnClickOutside(event)}
			content={({ position, childRect, popoverRect }) => (
				<ArrowContainer
					position={position}
					childRect={childRect}
					popoverRect={popoverRect}
					arrowColor={'#fff'}
					arrowSize={12}
				>
					<form onSubmit={(event) => event.preventDefault()}>
						{(props.format.contains('H') || props.format.contains('h')) && (
							<input
								className="time-input"
								type="number"
								placeholder={'hours'}
								value={hours != null ? hours.toString() : ''}
								onChange={(event) => handleHoursChange(event)}
								onKeyDown={(event) => handleSubmit(event)}
							/>
						)}
						{props.format.contains('m') && (
							<input
								className="time-input"
								type="number"
								placeholder={'minutes'}
								value={minutes != null ? minutes.toString() : ''}
								onChange={(event) => handleMinutesChange(event)}
								onKeyDown={(event) => handleSubmit(event)}
							/>
						)}
						{props.format.contains('s') && (
							<input
								className="time-input"
								type="number"
								placeholder={'seconds'}
								value={seconds != null ? seconds.toString() : ''}
								onChange={(event) => handleSecondsChange(event)}
								onKeyDown={(event) => handleSubmit(event)}
							/>
						)}
					</form>
				</ArrowContainer>
			)}
		>
			<button className="set-time-button" onClick={() => handleClick()}>
				Set
			</button>
		</Popover>
	);
};

export default TimeInput;
