import React, { useState } from 'react';
import { StopwatchState } from '../stopwatch/StopwatchState';
import Timetracker from '../main';
import StopwatchValueContainer from './StopwatchValueContainer';

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
	const STOPWATCH_INTERVAL = 100;

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

	const createInterval = (): number => {
		if (intervalId !== 0) {
			window.clearInterval(intervalId);
		}
		let interValId = window.setInterval(() => {
			setCurrentValue(props.getCurrentStopwatchTime());
		}, STOPWATCH_INTERVAL);
		setIntervalId(interValId);
		return interValId;
	};

	const clearInterval = (givenIntervalId?: number) => {
		if (givenIntervalId) {
			window.clearInterval(givenIntervalId);
		} else if (intervalId !== 0) {
			window.clearInterval(intervalId);
			setIntervalId(0);
		}
	};

	const reload = () => {
		setCurrentValue(props.getCurrentStopwatchTime());
		clearInterval(createInterval());
	};

	return (
		<div className="stopwatch-sidebar">
			<div className="stopwatch-buttons">
				<button className="start-stop-button stopwatch-function-button" onClick={startOrStopStopwatch}>
					{stopwatchState === StopwatchState.STARTED ? 'Pause' : 'Start'}
				</button>
				<button className="reset-button stopwatch-function-button" onClick={resetStopwatch}>
					Reset
				</button>
			</div>
			<StopwatchValueContainer
				stopwatchValue={props.getCurrentStopwatchTime()}
				setStopwatchValue={props.setCurrentStopwatchTime}
				stopStopwatch={() => stopStopwatch()}
				plugin={props.plugin}
			></StopwatchValueContainer>
			<button className="reload-button" onClick={reload} />
		</div>
	);
};
