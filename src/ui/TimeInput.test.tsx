import { render, fireEvent } from '@testing-library/react';
import TimeInput, { TimeInputProps } from './TimeInput';
import { TimeUnit } from './timeUnit';
import { createRef, useState } from 'react';
import useHandleTimeChange from './hooks/useHandleTimeChange';
import useHandleRemoval from './hooks/useHandleRemoval';

jest.mock('./hooks/useHandleTimeChange');
jest.mock('./hooks/useHandleRemoval');
jest.mock('react', () => ({
	...jest.requireActual('react'),
	useState: jest.fn(),
}));

describe('TimeInput', () => {
	const mockDoHandleTimeChange = jest.fn();
	const mockDoHandleRemoval = jest.fn();
	const mockSetCursorPosition = jest.fn();

	beforeEach(() => {
		(useHandleTimeChange as jest.Mock).mockReturnValue({ doHandleTimeChange: mockDoHandleTimeChange });
		(useHandleRemoval as jest.Mock).mockReturnValue({ doHandleRemoval: mockDoHandleRemoval });
		(useState as jest.Mock).mockReturnValue([[], mockSetCursorPosition]);
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	const defaultProps: TimeInputProps = {
		timeUnit: TimeUnit.MINUTES,
		settings: { trimLeadingZeros: true } as any,
		stopwatchValue: '01:00:00',
		isEditing: true,
		focusRef: createRef<HTMLInputElement>(),
		setStopwatchValue: jest.fn(),
	};

	it('should render correctly', () => {
		const { getByPlaceholderText } = render(<TimeInput {...defaultProps} />);
		expect(getByPlaceholderText('0') as HTMLInputElement).toBeDefined();
	});

	it('onChange: should call doHandleTimeChange on value change', () => {
		const { getByPlaceholderText } = render(<TimeInput {...defaultProps} />);
		const input = getByPlaceholderText('0') as HTMLInputElement;

		fireEvent.change(input, { target: { value: '02' } });

		expect(mockDoHandleTimeChange).toHaveBeenCalledWith(
			expect.any(Object),
			defaultProps.stopwatchValue,
			defaultProps.timeUnit,
		);
	});

	it('onChange: should call setCursorPosition on value change', () => {
		const { getByPlaceholderText } = render(<TimeInput {...defaultProps} />);
		const input = getByPlaceholderText('0') as HTMLInputElement;
		const selectionStart = 2;
		const event = { target: { value: '02', selectionStart: selectionStart } };

		fireEvent.change(input, event);

		expect(mockSetCursorPosition).toHaveBeenCalledWith(selectionStart);
	});

	it('onKeyDown: should call doHandleRemoval on backspace key', () => {
		const { getByPlaceholderText } = render(<TimeInput {...defaultProps} />);
		const input = getByPlaceholderText('0') as HTMLInputElement;

		fireEvent.keyDown(input, { key: 'Backspace' });

		expect(mockDoHandleRemoval).toHaveBeenCalledWith(
			expect.any(Object),
			defaultProps.stopwatchValue,
			defaultProps.timeUnit,
		);
	});

	it('onKeyDown: should call setCursorPosition on backspace key', () => {
		const { getByPlaceholderText } = render(<TimeInput {...defaultProps} />);
		const input = getByPlaceholderText('0') as HTMLInputElement;
		const selectionStart = 2;
		input.selectionStart = selectionStart;
		defaultProps.focusRef.current = input;

		fireEvent.keyDown(input, { key: 'Backspace' });

		expect(mockSetCursorPosition).toHaveBeenCalledWith(selectionStart + 1);
	});

	it('onKeyDown: should call doHandleRemoval on delete key', () => {
		const { getByPlaceholderText } = render(<TimeInput {...defaultProps} />);
		const input = getByPlaceholderText('0') as HTMLInputElement;

		fireEvent.keyDown(input, { key: 'Delete' });

		expect(mockDoHandleRemoval).toHaveBeenCalledWith(
			expect.any(Object),
			defaultProps.stopwatchValue,
			defaultProps.timeUnit,
		);
	});

	it('onKeyDown: should call setCursorPosition on delete key', () => {
		const { getByPlaceholderText } = render(<TimeInput {...defaultProps} />);
		const input = getByPlaceholderText('0') as HTMLInputElement;
		const selectionStart = 2;
		input.selectionStart = selectionStart;
		defaultProps.focusRef.current = input;

		fireEvent.keyDown(input, { key: 'Delete' });

		expect(mockSetCursorPosition).toHaveBeenCalledWith(selectionStart + 1);
	});

	it('onKeyDown: should do nothing on other keys', () => {
		const { getByPlaceholderText } = render(<TimeInput {...defaultProps} />);
		const input = getByPlaceholderText('0') as HTMLInputElement;

		fireEvent.keyDown(input, { key: 'Enter' });

		expect(mockSetCursorPosition).toHaveBeenCalledTimes(0);
		expect(mockDoHandleRemoval).toHaveBeenCalledTimes(0);
	});

	it('onFocus: should set selectionRange on ref to zero', () => {
		const { getByPlaceholderText } = render(<TimeInput {...defaultProps} />);
		const input = getByPlaceholderText('0') as HTMLInputElement;
		input.selectionStart = 2;

		fireEvent.focus(input);

		expect(input.selectionStart).toBe(0);
	});
});
