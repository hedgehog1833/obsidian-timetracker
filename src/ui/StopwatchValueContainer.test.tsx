import { fireEvent, render } from '@testing-library/react';
import { TimetrackerSettings } from '../main';
import { StopwatchValueContainer, StopwatchValueContainerProps } from './StopwatchValueContainer';

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
		fireEvent.mouseDown(activeDocument.body);

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

	it('pressing escape key changes button text back to "Set"', () => {
		// given
		const { getByTestId } = render(<StopwatchValueContainer {...defaultProps} />);
		const button = getByTestId('stopwatch-edit-button') as HTMLButtonElement;

		// when
		fireEvent.click(button);

		// then
		expect(button.textContent).toBe('Return');

		// when
		fireEvent.keyDown(activeDocument, { key: 'Escape', code: 'Escape' });

		// then
		expect(button.textContent).toBe('Set');
	});

	it('exits edit mode from the view document when it differs from activeDocument', () => {
		const iframe = document.createElement('iframe');
		document.body.appendChild(iframe);
		const viewDocument = iframe.contentDocument as Document;
		const container = viewDocument.createElement('div');
		viewDocument.body.appendChild(container);
		const { getByTestId, unmount } = render(<StopwatchValueContainer {...defaultProps} />, { container });
		const button = getByTestId('stopwatch-edit-button') as HTMLButtonElement;

		fireEvent.click(button);
		expect(button.textContent).toBe('Return');

		fireEvent.mouseDown(viewDocument.body);
		expect(button.textContent).toBe('Set');

		fireEvent.click(button);
		expect(button.textContent).toBe('Return');

		fireEvent.keyDown(viewDocument, { key: 'Escape', code: 'Escape' });
		expect(button.textContent).toBe('Set');

		unmount();
		iframe.remove();
	});
});
