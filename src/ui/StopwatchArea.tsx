import React, { useState } from 'react';
import { StopwatchState } from '../stopwatch/StopwatchState';
import Timetracker from '../main';
import StopwatchValue from './StopwatchValueContainer';

interface StopwatchAreaProps {
	plugin: Timetracker;
	start: () => StopwatchState;
	stop: () => StopwatchState;
	reset: () => StopwatchState;
	getCurrentStopwatchTime: () => string;
	setCurrentStopwatchTime: (milliseconds: number) => void;
}

export const StopwatchArea = (props: StopwatchAreaProps) => {
	const [intervalId, setIntervalId] = useState(0);
	const [stopwatchState, setStopwatchState] = useState(StopwatchState.INITIALIZED);
	const [, setCurrentValue] = useState(props.getCurrentStopwatchTime);

	const startOrStopStopwatch = () => {
		if (stopwatchState !== StopwatchState.STARTED) {
			setStopwatchState(props.start());
			createInterval();
		} else {
			setStopwatchState(props.stop());
			clearInterval();
		}
	};

	const stopStopwatch = () => {
		if (stopwatchState == StopwatchState.STARTED) {
			setStopwatchState(props.stop());
			clearInterval();
		}
	};

	const resetStopwatch = () => {
		setStopwatchState(props.reset());
		setCurrentValue(props.getCurrentStopwatchTime());
		clearInterval();
	};

	const createInterval = () => {
		if (intervalId !== 0) {
			window.clearInterval(intervalId);
		}
		setIntervalId(
			window.setInterval(() => {
				setCurrentValue(props.getCurrentStopwatchTime());
			}, props.plugin.settings.interval),
		);
	};

	const clearInterval = () => {
		if (intervalId !== 0) {
			window.clearInterval(intervalId);
			setIntervalId(0);
		}
	};

	const reload = () => {
		setCurrentValue(props.getCurrentStopwatchTime);
		createInterval();
		clearInterval();
	};

	return (
		<div className="stopwatch-sidebar">
			<div className="stopwatch-buttons">
				<button className="stopwatch-function-button" onClick={startOrStopStopwatch}>
					{stopwatchState === StopwatchState.STARTED ? 'Pause' : 'Start'}
				</button>
				<button className="stopwatch-function-button" onClick={resetStopwatch}>
					Reset
				</button>
			</div>
			<StopwatchValue
				stopwatchValue={props.getCurrentStopwatchTime()}
				setStopwatchValue={props.setCurrentStopwatchTime}
				stopStopwatch={() => stopStopwatch()}
			></StopwatchValue>
			<button className="reload-button" onClick={reload} />
		</div>
	);
};
