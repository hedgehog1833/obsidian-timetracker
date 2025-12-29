import { render, fireEvent } from '@testing-library/react';
import TimeInput, { TimeInputProps } from './TimeInput';
import { TimeUnit } from './timeUnit';
import { createRef, useState } from 'react';
import useAdjustTimeInputOnChange from './hooks/useAdjustTimeInputOnChange';
import useAdjustTimeInputOnRemoval from './hooks/useAdjustTimeInputOnRemoval';
import useSetStopwatchValue from './hooks/useSetStopwatchValue';
import { TimetrackerSettings } from '../main';

jest.mock('./hooks/useAdjustTimeInputOnChange');
jest.mock('./hooks/useAdjustTimeInputOnRemoval');
jest.mock('./hooks/useSetStopwatchValue');
jest.mock('react', () => ({
	...jest.requireActual('react'),
	useState: jest.fn(),
}));

describe('TimeInput', () => {
	const mockDoAdjustTimeInputOnChange = jest.fn();
	const mockDoAdjustTimeInputOnRemoval = jest.fn();
	const mockDoSetStopwatchValue = jest.fn();
	const mockSetCursorPosition = jest.fn();

	beforeEach(() => {
		(useAdjustTimeInputOnChange as jest.Mock).mockReturnValue({
			doAdjustTimeInputOnChange: mockDoAdjustTimeInputOnChange,
		});
		(useAdjustTimeInputOnRemoval as jest.Mock).mockReturnValue({
			doAdjustTimeInputOnRemoval: mockDoAdjustTimeInputOnRemoval,
		});
		(useSetStopwatchValue as jest.Mock).mockReturnValue({ doSetStopwatchValue: mockDoSetStopwatchValue });
		(useState as jest.Mock).mockReturnValue([[], mockSetCursorPosition]);
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	const defaultProps: TimeInputProps = {
		timeUnit: TimeUnit.MINUTES,
		settings: { trimLeadingZeros: true } as TimetrackerSettings,
		stopwatchValue: '01:00:00',
		isEditing: true,
		focusRef: createRef<HTMLInputElement>(),
		setStopwatchValue: jest.fn(),
	};

	it('should render correctly', () => {
		// when
		const { getByTestId } = render(<TimeInput {...defaultProps} />);

		// then
		expect(getByTestId('time-input') as HTMLInputElement).toBeDefined();
	});

	it('onChange: doAdjustTimeInputOnChange provides adjusted input values for doSetStopwatchValue', () => {
		// given
		mockDoAdjustTimeInputOnChange.mockReturnValue({
			tempHours: 3,
			tempMinutes: 2,
			tempSeconds: 1,
		});
		const { getByTestId } = render(<TimeInput {...defaultProps} />);
		const input = getByTestId('time-input') as HTMLInputElement;

		// when
		fireEvent.change(input, { target: { value: '02', selectionStart: 2 } });

		// then
		expect(mockDoAdjustTimeInputOnChange).toHaveBeenCalled();
		const returned = mockDoAdjustTimeInputOnChange.mock.results[0].value;
		expect(returned).toEqual({
			tempHours: 3,
			tempMinutes: 2,
			tempSeconds: 1,
		});
		expect(mockDoSetStopwatchValue).toHaveBeenCalledWith(3, 2, 1);
	});

	it.each([null, undefined])(
		'onChange: does not call doSetStopwatchValue when doAdjustTimeInputOnChange returns %p',
		(returned) => {
			// given
			mockDoAdjustTimeInputOnChange.mockReturnValue(returned);
			const { getByTestId } = render(<TimeInput {...defaultProps} />);
			const input = getByTestId('time-input') as HTMLInputElement;

			// when
			fireEvent.change(input, { target: { value: '02', selectionStart: 2 } });

			// then
			expect(mockDoAdjustTimeInputOnChange).toHaveBeenCalled();
			expect(mockDoSetStopwatchValue).not.toHaveBeenCalled();
		},
	);

	it('onChange: should call setCursorPosition on value change', () => {
		// given
		const { getByTestId } = render(<TimeInput {...defaultProps} />);
		const input = getByTestId('time-input') as HTMLInputElement;
		const selectionStart = 2;
		const event = { target: { value: '02', selectionStart: selectionStart } };

		// when
		fireEvent.change(input, event);

		// then
		expect(mockSetCursorPosition).toHaveBeenCalledWith(selectionStart);
	});

	it('onKeyDown: doAdjustTimeInputOnRemoval provides adjusted input values for doSetStopwatchValue on backspace key', () => {
		// given
		mockDoAdjustTimeInputOnRemoval.mockReturnValue({
			tempHours: 3,
			tempMinutes: 2,
			tempSeconds: 1,
		});
		const { getByTestId } = render(<TimeInput {...defaultProps} />);
		const input = getByTestId('time-input') as HTMLInputElement;

		// when
		fireEvent.keyDown(input, { key: 'Backspace' });

		// then
		expect(mockDoAdjustTimeInputOnRemoval).toHaveBeenCalled();
		const returned = mockDoAdjustTimeInputOnRemoval.mock.results[0].value;
		expect(returned).toEqual({
			tempHours: 3,
			tempMinutes: 2,
			tempSeconds: 1,
		});
		expect(mockDoSetStopwatchValue).toHaveBeenCalledWith(3, 2, 1);
	});

	it('onKeyDown: should call setCursorPosition on backspace key', () => {
		// given
		const { getByTestId } = render(<TimeInput {...defaultProps} />);
		const input = getByTestId('time-input') as HTMLInputElement;
		const selectionStart = 2;
		input.selectionStart = selectionStart;
		defaultProps.focusRef.current = input;

		// when
		fireEvent.keyDown(input, { key: 'Backspace' });

		// then
		expect(mockSetCursorPosition).toHaveBeenCalledWith(selectionStart + 1);
	});

	it('onKeyDown: doAdjustTimeInputOnRemoval provides adjusted input values for doSetStopwatchValue on delete key', () => {
		// given
		mockDoAdjustTimeInputOnRemoval.mockReturnValue({
			tempHours: 3,
			tempMinutes: 2,
			tempSeconds: 1,
		});
		const { getByTestId } = render(<TimeInput {...defaultProps} />);
		const input = getByTestId('time-input') as HTMLInputElement;

		// when
		fireEvent.keyDown(input, { key: 'Delete' });

		// then
		expect(mockDoAdjustTimeInputOnRemoval).toHaveBeenCalled();
		const returned = mockDoAdjustTimeInputOnRemoval.mock.results[0].value;
		expect(returned).toEqual({
			tempHours: 3,
			tempMinutes: 2,
			tempSeconds: 1,
		});
		expect(mockDoSetStopwatchValue).toHaveBeenCalledWith(3, 2, 1);
	});

	it('onKeyDown: should call setCursorPosition on delete key', () => {
		// given
		const { getByTestId } = render(<TimeInput {...defaultProps} />);
		const input = getByTestId('time-input') as HTMLInputElement;
		const selectionStart = 2;
		input.selectionStart = selectionStart;
		defaultProps.focusRef.current = input;

		// when
		fireEvent.keyDown(input, { key: 'Delete' });

		// then
		expect(mockSetCursorPosition).toHaveBeenCalledWith(selectionStart + 1);
	});

	it('onKeyDown: should do nothing on other keys', () => {
		// given
		const { getByTestId } = render(<TimeInput {...defaultProps} />);
		const input = getByTestId('time-input') as HTMLInputElement;

		// when
		fireEvent.keyDown(input, { key: 'Enter' });

		// then
		expect(mockSetCursorPosition).toHaveBeenCalledTimes(0);
		expect(mockDoAdjustTimeInputOnRemoval).toHaveBeenCalledTimes(0);
	});

	it('onFocus: should set selectionRange on ref to zero', () => {
		// given
		const { getByTestId } = render(<TimeInput {...defaultProps} />);
		const input = getByTestId('time-input') as HTMLInputElement;
		input.selectionStart = 2;

		// when
		fireEvent.focus(input);

		// then
		expect(input.selectionStart).toBe(0);
	});
});
