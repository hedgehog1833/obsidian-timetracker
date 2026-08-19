import { useEffect, useReducer } from 'react';
import { TimetrackerSettings } from '../main';
import format from '../stopwatch/formatter';
import { StopwatchController } from '../stopwatch/stopwatchController';
import { StopwatchValueContainer } from './StopwatchValueContainer';

export type StopwatchAreaProps = {
	settings: TimetrackerSettings;
	stopwatch: StopwatchController;
};

export const StopwatchArea = (props: StopwatchAreaProps) => {
	const [, rerender] = useReducer((renderCount: number) => renderCount + 1, 0);

	useEffect(() => props.stopwatch.subscribe(rerender), [props.stopwatch]);

	return (
		<div className="stopwatch-sidebar">
			<div className="stopwatch-buttons">
				<button
					className="start-stop-button stopwatch-function-button"
					onClick={() => props.stopwatch.startOrStop()}
					data-testid="start-stop-button"
				>
					{props.stopwatch.isRunning() ? 'Pause' : 'Start'}
				</button>
				<button
					className="reset-button stopwatch-function-button"
					onClick={() => props.stopwatch.reset()}
					data-testid="reset-button"
				>
					Reset
				</button>
			</div>
			<StopwatchValueContainer
				stopwatchValue={format(props.stopwatch.getElapsedTime())}
				setStopwatchValue={(startTimestamp: number) => props.stopwatch.setStartTimestamp(startTimestamp)}
				stopStopwatch={() => props.stopwatch.stop()}
				settings={props.settings}
			/>
		</div>
	);
};
