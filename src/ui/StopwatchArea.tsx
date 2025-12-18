import { useRef, useState } from 'react';
import { StopwatchState } from '../stopwatch/stopwatchState';
import { TimetrackerSettings } from '../main';
import StopwatchValueContainer from './StopwatchValueContainer';

export type StopwatchAreaProps = {
	settings: TimetrackerSettings;
	start: () => StopwatchState;
	stop: () => StopwatchState;
	reset: () => StopwatchState;
	getCurrentStopwatchTime: () => string;
	setCurrentStopwatchTime: (milliseconds: number) => void;
	saveWorkspace: () => void;
};

export const StopwatchArea = (props: StopwatchAreaProps) => {
	const [intervalId, setIntervalId] = useState<number>(0);
	const [stopwatchState, setStopwatchState] = useState<StopwatchState>(StopwatchState.INITIALIZED);
	const [, setCurrentValue] = useState<string>(props.getCurrentStopwatchTime);
	const lastSaveAtRef = useRef<number>(0);
	const STOPWATCH_INTERVAL_MILLISECONDS = 1000;
	const SAVE_WORKSPACE_INTERVAL_MILLISECONDS = 60000;

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
			saveWorkspaceTimed();
		}, STOPWATCH_INTERVAL_MILLISECONDS);
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
		if (stopwatchState === StopwatchState.STARTED) {
			clearInterval();
			createInterval();
		} else {
			clearInterval(createInterval());
		}
	};

	const saveWorkspaceTimed = () => {
		if (!props.settings.persistTimerValue) {
			return;
		}
		const now = Date.now();
		if (lastSaveAtRef.current === 0) {
			lastSaveAtRef.current = now;
		}
		if (now - lastSaveAtRef.current >= SAVE_WORKSPACE_INTERVAL_MILLISECONDS) {
			props.saveWorkspace();
			lastSaveAtRef.current = now;
		}
	};

	return (
		<div className="stopwatch-sidebar">
			<div className="stopwatch-buttons">
				<button
					className="start-stop-button stopwatch-function-button"
					onClick={startOrStopStopwatch}
					data-testid="start-stop-button"
				>
					{stopwatchState === StopwatchState.STARTED ? 'Pause' : 'Start'}
				</button>
				<button className="reset-button stopwatch-function-button" onClick={resetStopwatch} data-testid="reset-button">
					Reset
				</button>
			</div>
			<StopwatchValueContainer
				stopwatchValue={props.getCurrentStopwatchTime()}
				setStopwatchValue={props.setCurrentStopwatchTime}
				stopStopwatch={() => stopStopwatch()}
				settings={props.settings}
			/>
			<button className="reload-button" onClick={reload} data-testid="reload-button" />
		</div>
	);
};
