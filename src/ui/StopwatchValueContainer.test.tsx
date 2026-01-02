import { StopwatchValueContainer, StopwatchValueContainerProps } from './StopwatchValueContainer';
import { fireEvent, getByTestId, render } from '@testing-library/react';
import { TimetrackerSettings } from '../main';

describe('StopwatchValueContainer', () => {
	let defaultProps: StopwatchValueContainerProps;

	beforeEach(() => {
		defaultProps = {
			settings: { trimLeadingZeros: true } as TimetrackerSettings,
			stopwatchValue: '00:00:00',
			setStopwatchValue: jest.fn(),
			stopStopwatch: jest.fn(),
		};
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should render stopwatch-edit-button correctly', () => {
		// when
		const { getByTestId } = render(<StopwatchValueContainer {...defaultProps} />);
		const button = getByTestId('stopwatch-edit-button') as HTMLButtonElement;

		// then
		expect(button).toBeDefined();
		expect(button.textContent).toBe('Set');
	});

	it(`onClick 'stopwatch-edit-button': button text changes to 'Return'`, () => {
		// given
		// (defaultProps.start as jest.Mock).mockReturnValue(StopwatchState.STARTED);
		const { getByTestId } = render(<StopwatchValueContainer {...defaultProps} />);
		const button = getByTestId('stopwatch-edit-button') as HTMLButtonElement;

		// when
		fireEvent.click(button);

		// then
		expect(button.textContent).toBe('Return');
	});

	it(`onClick 'stopwatch-edit-button': clicking twice changes button text back to 'Set'`, () => {
		// given
		const { getByTestId } = render(<StopwatchValueContainer {...defaultProps} />);
		const button = getByTestId('stopwatch-edit-button') as HTMLButtonElement;

		// when
		fireEvent.click(button);

		// then
		expect(button.textContent).toBe('Return');

		// when
		fireEvent.click(button);

		// then
		expect(button.textContent).toBe('Set');
	});

	it(`clicking outside the wrapper changes button text back to 'Set'`, () => {
		// given
		const { getByTestId } = render(<StopwatchValueContainer {...defaultProps} />);
		const button = getByTestId('stopwatch-edit-button') as HTMLButtonElement;

		// when
		fireEvent.click(button);

		// then
		expect(button.textContent).toBe('Return');

		// when
		fireEvent.mouseDown(document.body);

		// then
		expect(button.textContent).toBe('Set');
	});

	it('clicking inside the wrapper does not close editing', () => {
		// given
		const { getByTestId } = render(<StopwatchValueContainer {...defaultProps} />);
		const container = getByTestId('stopwatch-value-container') as HTMLElement;
		const button = getByTestId('stopwatch-edit-button') as HTMLButtonElement;

		// when
		fireEvent.click(button);

		// then
		expect(button.textContent).toBe('Return');

		// when
		fireEvent.mouseDown(container);

		// then
		expect(button.textContent).toBe('Return');
	});
});
