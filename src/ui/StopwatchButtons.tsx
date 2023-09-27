import React, { useState } from 'react';
import { StopwatchModel } from '../stopwatch/StopwatchModel';
import { StopwatchState } from '../stopwatch/StopwatchState';
import EditorStopwatch from '../../main';

interface StopwatchButtonsProps {
	plugin: EditorStopwatch;
	model: StopwatchModel;
}

export const StopwatchButtons = (props: StopwatchButtonsProps) => {
	const [intervalId, setIntervalId] = useState(0);
	const [currentStopwatchValue, setCurrentStopwatchValue] = useState('00:00:00.000');
	const [stopwatchState, setStopwatchState] = useState(StopwatchState.INITIALIZED);

	const startOrStopStopwatch = () => {
		if (stopwatchState != StopwatchState.STARTED) {
			props.model.start();
			setStopwatchState(props.model.getState());
			createInterval();
		} else {
			props.model.stop();
			setStopwatchState(props.model.getState());
			clearInterval();
		}
	};

	const resetStopwatch = () => {
		props.model.reset();
		setStopwatchState(props.model.getState());
		setCurrentStopwatchValue(props.model.getCurrentValue(props.plugin.settings.format));
		clearInterval();
	};

	const createInterval = () => {
		if (intervalId != 0) {
			window.clearInterval(intervalId);
		}

		setIntervalId(
			window.setInterval(() => {
				setCurrentStopwatchValue(props.model.getCurrentValue(props.plugin.settings.format));
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
		<div>
			<button className={'start-stop'} onClick={startOrStopStopwatch}>
				{stopwatchState == StopwatchState.STARTED ? 'Stop' : 'Start'}
			</button>
			<button className={'reset'} onClick={resetStopwatch}>
				Reset
			</button>
			<div className={'stopwatch-value'}>{currentStopwatchValue}</div>
		</div>
	);
};
