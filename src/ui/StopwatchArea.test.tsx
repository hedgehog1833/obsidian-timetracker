import { StopwatchArea, StopwatchAreaProps } from './StopwatchArea';
import { fireEvent, getByTestId, render } from '@testing-library/react';
import { TimetrackerSettings } from '../main';
import { useState } from 'react';
import { StopwatchState } from '../stopwatch/stopwatchState';

jest.mock('react', () => ({
	...jest.requireActual('react'),
	useState: jest.fn(),
}));

describe('StopwatchArea', () => {
	const setIntervalId = jest.fn();
	const setStopwatchState = jest.fn();
	const setCurrentValue = jest.fn();

	// beforeEach(() => {
	// 	(useState as jest.Mock)
	// 		.mockReturnValueOnce([0, setIntervalId])
	// 		.mockReturnValueOnce([StopwatchState.INITIALIZED, setStopwatchState])
	// 		.mockReturnValueOnce(['', setCurrentValue]);
	// });

	beforeEach(() => {
		(useState as jest.Mock)
			.mockImplementationOnce(() => [0, setIntervalId])
			.mockImplementationOnce(() => [StopwatchState.INITIALIZED, setStopwatchState])
			.mockImplementationOnce(() => ['', setCurrentValue]);
	});

	const defaultProps: StopwatchAreaProps = {
		settings: { trimLeadingZeros: true } as TimetrackerSettings,
		start: jest.fn(),
		stop: jest.fn(),
		reset: jest.fn(),
		getCurrentStopwatchTime: jest.fn(),
		setCurrentStopwatchTime: jest.fn(),
	};

	it('should render start-stop-button correctly', () => {
		// when
		const { getByTestId } = render(<StopwatchArea {...defaultProps} />);

		// then
		expect(getByTestId('start-stop-button') as HTMLButtonElement).toBeDefined();
	});

	it('should render reset-button correctly', () => {
		// when
		const { getByTestId } = render(<StopwatchArea {...defaultProps} />);

		// then
		expect(getByTestId('reset-button') as HTMLButtonElement).toBeDefined();
	});

	it('should render reload-button correctly', () => {
		// when
		const { getByTestId } = render(<StopwatchArea {...defaultProps} />);

		// then
		expect(getByTestId('reload-button') as HTMLButtonElement).toBeDefined();
	});

	it('should render stopwatch-value-container correctly', () => {
		// when
		const { getByTestId } = render(<StopwatchArea {...defaultProps} />);

		// then
		expect(getByTestId('stopwatch-value-container') as HTMLElement).toBeDefined();
	});

	it(`onClick 'start-stop-button': should call startOrStopStopwatch`, () => {
		// given
		const { getByTestId } = render(<StopwatchArea {...defaultProps} />);
		const button = getByTestId('start-stop-button') as HTMLButtonElement;

		// when
		fireEvent.click(button);

		// then
		expect(setStopwatchState).toHaveBeenCalled();
	});
});
