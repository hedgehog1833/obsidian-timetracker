import React from 'react';
import useAdjustTimeInputOnRemoval from './useAdjustTimeInputOnRemoval';
import { TimeUnit } from '../timeUnit';

describe('useAdjustTimeInputOnRemoval', () => {
	const baseStopwatch = '12:34:56';

	it('returns undefined when selectionStart is not set', () => {
		// given
		const focusRef = { current: null } as React.RefObject<HTMLInputElement | null>;
		const { doAdjustTimeInputOnRemoval } = useAdjustTimeInputOnRemoval(focusRef);
		const event = { key: 'Delete' } as React.KeyboardEvent<HTMLInputElement>;

		// when
		const result = doAdjustTimeInputOnRemoval(event, baseStopwatch, TimeUnit.HOURS);

		// then
		expect(result).toBeUndefined();
	});

	it('hours: cursor 0 + Delete -> removes first digit', () => {
		// given
		const focusRef = { current: { selectionStart: 0 } } as React.RefObject<HTMLInputElement | null>;
		const { doAdjustTimeInputOnRemoval } = useAdjustTimeInputOnRemoval(focusRef);
		const event = { key: 'Delete' } as React.KeyboardEvent<HTMLInputElement>;

		// when
		const result = doAdjustTimeInputOnRemoval(event, baseStopwatch, TimeUnit.HOURS);

		// then
		expect(result).toEqual({ tempHours: 2, tempMinutes: 34, tempSeconds: 56 });
	});

	it('hours: cursor 1 + Backspace -> removes first digit', () => {
		// given
		const focusRef = { current: { selectionStart: 1 } } as React.RefObject<HTMLInputElement | null>;
		const { doAdjustTimeInputOnRemoval } = useAdjustTimeInputOnRemoval(focusRef);
		const event = { key: 'Backspace' } as React.KeyboardEvent<HTMLInputElement>;

		// when
		const result = doAdjustTimeInputOnRemoval(event, baseStopwatch, TimeUnit.HOURS);

		// then
		expect(result).toEqual({ tempHours: 2, tempMinutes: 34, tempSeconds: 56 });
	});

	it('hours: cursor 1 + Delete -> removes last digit', () => {
		// given
		const focusRef = { current: { selectionStart: 1 } } as React.RefObject<HTMLInputElement | null>;
		const { doAdjustTimeInputOnRemoval } = useAdjustTimeInputOnRemoval(focusRef);
		const event = { key: 'Delete' } as React.KeyboardEvent<HTMLInputElement>;

		// when
		const result = doAdjustTimeInputOnRemoval(event, baseStopwatch, TimeUnit.HOURS);

		// then
		expect(result).toEqual({ tempHours: 1, tempMinutes: 34, tempSeconds: 56 });
	});

	it('hours: cursor 2 + Backspace -> removes last digit', () => {
		// given
		const focusRef = { current: { selectionStart: 2 } } as React.RefObject<HTMLInputElement | null>;
		const { doAdjustTimeInputOnRemoval } = useAdjustTimeInputOnRemoval(focusRef);
		const event = { key: 'Backspace' } as React.KeyboardEvent<HTMLInputElement>;

		// when
		const result = doAdjustTimeInputOnRemoval(event, baseStopwatch, TimeUnit.HOURS);

		// then
		expect(result).toEqual({ tempHours: 1, tempMinutes: 34, tempSeconds: 56 });
	});

	it('minutes: cursor 0 + Delete -> removes first digit of minutes', () => {
		// given
		const focusRef = { current: { selectionStart: 0 } } as React.RefObject<HTMLInputElement | null>;
		const { doAdjustTimeInputOnRemoval } = useAdjustTimeInputOnRemoval(focusRef);
		const event = { key: 'Delete' } as React.KeyboardEvent<HTMLInputElement>;

		// when
		const result = doAdjustTimeInputOnRemoval(event, baseStopwatch, TimeUnit.MINUTES);

		// then
		expect(result).toEqual({ tempHours: 12, tempMinutes: 4, tempSeconds: 56 });
	});

	it('minutes: cursor 1 + Delete -> removes last digit of minutes', () => {
		// given
		const focusRef = { current: { selectionStart: 1 } } as React.RefObject<HTMLInputElement | null>;
		const { doAdjustTimeInputOnRemoval } = useAdjustTimeInputOnRemoval(focusRef);
		const event = { key: 'Delete' } as React.KeyboardEvent<HTMLInputElement>;

		// when
		const result = doAdjustTimeInputOnRemoval(event, baseStopwatch, TimeUnit.MINUTES);

		// then
		expect(result).toEqual({ tempHours: 12, tempMinutes: 3, tempSeconds: 56 });
	});

	it('seconds: cursor 2 + Backspace -> removes last digit of seconds', () => {
		// given
		const focusRef = { current: { selectionStart: 2 } } as React.RefObject<HTMLInputElement | null>;
		const { doAdjustTimeInputOnRemoval } = useAdjustTimeInputOnRemoval(focusRef);
		const event = { key: 'Backspace' } as React.KeyboardEvent<HTMLInputElement>;

		// when
		const result = doAdjustTimeInputOnRemoval(event, baseStopwatch, TimeUnit.SECONDS);

		// then
		expect(result).toEqual({ tempHours: 12, tempMinutes: 34, tempSeconds: 5 });
	});

	it('returns undefined when key/position do not match any removal rule', () => {
		// given
		const focusRef = { current: { selectionStart: 0 } } as React.RefObject<HTMLInputElement | null>;
		const { doAdjustTimeInputOnRemoval } = useAdjustTimeInputOnRemoval(focusRef);
		const event = { key: 'Backspace' } as React.KeyboardEvent<HTMLInputElement>;

		// when
		const result = doAdjustTimeInputOnRemoval(event, baseStopwatch, TimeUnit.HOURS);

		// then
		expect(result).toBeUndefined();
	});
});
