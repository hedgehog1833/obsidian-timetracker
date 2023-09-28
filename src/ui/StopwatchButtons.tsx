import { useState } from 'react';
import { StopwatchState } from '../stopwatch/StopwatchState';
import Timetracker from '../../main';
import React from 'react';

interface StopwatchButtonsProps {
	plugin: Timetracker;
	start: () => StopwatchState;
	stop: () => StopwatchState;
	reset: () => StopwatchState;
	getCurrentStopwatchTime: () => string;
}

export const StopwatchButtons = (props: StopwatchButtonsProps) => {
	const [intervalId, setIntervalId] = useState(0);
	const [stopwatchState, setStopwatchState] = useState(StopwatchState.INITIALIZED);
	const [, setCurrentValue] = useState(props.getCurrentStopwatchTime);

	const startOrStopStopwatch = () => {
		if (stopwatchState != StopwatchState.STARTED) {
			setStopwatchState(props.start());
			createInterval();
		} else {
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
		if (intervalId != 0) {
			window.clearInterval(intervalId);
		}
		setIntervalId(
			window.setInterval(() => {
				setCurrentValue(props.getCurrentStopwatchTime());
			}, props.plugin.settings.interval),
		);
	};

	const clearInterval = () => {
		if (intervalId != 0) {
			window.clearInterval(intervalId);
			setIntervalId(0);
		}
	};

	return (
		<div className={'stopwatch'}>
			<div className={'stopwatch-buttons'}>
				<button className={'start-stop-button'} onClick={startOrStopStopwatch}>
					{stopwatchState == StopwatchState.STARTED ? 'Pause' : 'Start'}
				</button>
				<button className={'reset-button'} onClick={resetStopwatch}>
					Reset
				</button>
			</div>
			<div className={'stopwatch-value'}>{props.getCurrentStopwatchTime()}</div>
		</div>
	);
};
