import { StopwatchArea, StopwatchAreaProps } from './StopwatchArea';
import { fireEvent, getByTestId, render } from '@testing-library/react';
import { TimetrackerSettings } from '../main';
import { StopwatchState } from '../stopwatch/stopwatchState';

describe('StopwatchArea', () => {
	let defaultProps: StopwatchAreaProps;

	beforeEach(() => {
		defaultProps = {
			settings: { trimLeadingZeros: true } as TimetrackerSettings,
			start: jest.fn(),
			stop: jest.fn(),
			reset: jest.fn(),
			getCurrentStopwatchTime: jest.fn(),
			setCurrentStopwatchTime: jest.fn(),
		};
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should render start-stop-button correctly', () => {
		// when
		const { getByTestId } = render(<StopwatchArea {...defaultProps} />);
		const button = getByTestId('start-stop-button') as HTMLButtonElement;

		// then
		expect(button).toBeDefined();
		expect(button.textContent).toBe('Start');
	});

	it('should render reset-button correctly', () => {
		// when
		const { getByTestId } = render(<StopwatchArea {...defaultProps} />);
		const button = getByTestId('reset-button') as HTMLButtonElement;

		// then
		expect(getByTestId('reset-button') as HTMLButtonElement).toBeDefined();
		expect(button.textContent).toBe('Reset');
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

	it(`onClick 'start-stop-button': button text changes to 'Pause'`, () => {
		// given
		(defaultProps.start as jest.Mock).mockReturnValue(StopwatchState.STARTED);
		const { getByTestId } = render(<StopwatchArea {...defaultProps} />);
		const button = getByTestId('start-stop-button') as HTMLButtonElement;

		// when
		fireEvent.click(button);

		// then
		expect(button.textContent).toBe('Pause');
	});

	it(`onClick 'start-stop-button': clicking twice changes button text back to 'Start'`, () => {
		// given
		(defaultProps.start as jest.Mock)
			.mockReturnValueOnce(StopwatchState.STARTED)
			.mockReturnValueOnce(StopwatchState.STOPPED);
		const { getByTestId } = render(<StopwatchArea {...defaultProps} />);
		const button = getByTestId('start-stop-button') as HTMLButtonElement;

		// when
		fireEvent.click(button);

		// then
		expect(button.textContent).toBe('Pause');

		// when
		fireEvent.click(button);

		// then
		expect(button.textContent).toBe('Start');
	});

	it(`onClick 'reset-button': clicking button after clicking start changes start button back text to 'Start'`, () => {
		// given
		(defaultProps.start as jest.Mock).mockReturnValue(StopwatchState.STARTED);
		(defaultProps.reset as jest.Mock).mockReturnValue(StopwatchState.INITIALIZED);
		const { getByTestId } = render(<StopwatchArea {...defaultProps} />);
		const startButton = getByTestId('start-stop-button') as HTMLButtonElement;
		const resetButton = getByTestId('reset-button') as HTMLButtonElement;

		// when
		fireEvent.click(startButton);

		// then
		expect(startButton.textContent).toBe('Pause');

		// when
		fireEvent.click(resetButton);

		// then
		expect(startButton.textContent).toBe('Start');
	});
});
