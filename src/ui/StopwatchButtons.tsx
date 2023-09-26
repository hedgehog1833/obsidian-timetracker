import React from 'react';
import { StopwatchModel } from '../stopwatch/StopwatchModel';
import { StopwatchState } from '../stopwatch/StopwatchState';

interface StopwatchButtonsProps {
	model: StopwatchModel;
}

export const StopwatchButtons = (props: StopwatchButtonsProps) => {
	const startOrStopStopwatch = () => {
		props.model.getState() == StopwatchState.STARTED ? props.model.stop() : props.model.start();
	};

	const resetStopwatch = () => {
		props.model.reset();
	};

	return (
		<div>
			<button className={'start-stop'} onClick={startOrStopStopwatch}>
				Start-Stop
			</button>
			<button className={'reset'} onClick={resetStopwatch}>
				Reset
			</button>
		</div>
	);
};
