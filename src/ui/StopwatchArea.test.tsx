import { act, fireEvent, render } from '@testing-library/react';
import { TimetrackerSettings } from '../main';
import { StopwatchController } from '../stopwatch/stopwatchController';
import { StopwatchArea, StopwatchAreaProps } from './StopwatchArea';

describe('StopwatchArea', () => {
	let defaultProps: StopwatchAreaProps;
	let stopwatch: StopwatchController;

	beforeEach(() => {
		stopwatch = new StopwatchController();
		defaultProps = {
			settings: { trimLeadingZeros: true } as TimetrackerSettings,
			stopwatch: stopwatch,
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
		expect(button).toBeDefined();
		expect(button.textContent).toBe('Reset');
	});

	it('should render stopwatch-value-container correctly', () => {
		// when
		const { getByTestId } = render(<StopwatchArea {...defaultProps} />);

		// then
		expect(getByTestId('stopwatch-value-container') as HTMLElement).toBeDefined();
	});

	it(`onClick 'start-stop-button': button text changes to 'Pause'`, () => {
		// given
		const { getByTestId } = render(<StopwatchArea {...defaultProps} />);
		const button = getByTestId('start-stop-button') as HTMLButtonElement;

		// when
		fireEvent.click(button);

		// then
		expect(stopwatch.isRunning()).toBe(true);
		expect(button.textContent).toBe('Pause');
	});

	it(`onClick 'start-stop-button': clicking twice changes button text back to 'Start'`, () => {
		// given
		const { getByTestId } = render(<StopwatchArea {...defaultProps} />);
		const button = getByTestId('start-stop-button') as HTMLButtonElement;

		// when
		fireEvent.click(button);

		// then
		expect(button.textContent).toBe('Pause');

		// when
		fireEvent.click(button);

		// then
		expect(stopwatch.isRunning()).toBe(false);
		expect(button.textContent).toBe('Start');
	});

	it("onClick 'start-stop-button': clicking the child's edit button should stop the stopwatch", () => {
		// given
		const { getByTestId } = render(<StopwatchArea {...defaultProps} />);
		fireEvent.click(getByTestId('start-stop-button') as HTMLButtonElement);

		// when
		fireEvent.click(getByTestId('stopwatch-edit-button') as HTMLButtonElement);

		// then
		expect(stopwatch.isRunning()).toBe(false);
	});

	it(`onClick 'reset-button': clicking button after clicking start changes start button text back to 'Start'`, () => {
		// given
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
		expect(stopwatch.isRunning()).toBe(false);
		expect(startButton.textContent).toBe('Start');
	});

	it('re-renders when the stopwatch changes outside the view', () => {
		// given
		const { getByTestId } = render(<StopwatchArea {...defaultProps} />);
		const button = getByTestId('start-stop-button') as HTMLButtonElement;
		expect(button.textContent).toBe('Start');

		// when
		act(() => {
			stopwatch.start();
		});

		// then
		expect(button.textContent).toBe('Pause');
	});

	it('unsubscribes from the stopwatch on unmount', () => {
		// given
		const { unmount } = render(<StopwatchArea {...defaultProps} />);

		// when
		unmount();

		// then
		expect(() => stopwatch.start()).not.toThrow();
	});
});
