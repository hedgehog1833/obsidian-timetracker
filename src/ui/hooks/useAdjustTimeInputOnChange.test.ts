import React from 'react';
import useAdjustTimeInputOnChange from './useAdjustTimeInputOnChange';
import { TimeUnit } from '../timeUnit';

describe('useAdjustTimeInputOnChange', () => {
	const baseStopwatch = '01:02:03';

	it('adjustInput: selectionStart 0 leaves value unchanged', () => {
		// given
		const { doAdjustTimeInputOnChange } = useAdjustTimeInputOnChange();
		const event = { target: { value: '12', selectionStart: 0 } } as React.ChangeEvent<HTMLInputElement>;

		// when
		const result = doAdjustTimeInputOnChange(event, baseStopwatch, TimeUnit.HOURS);

		// then
		expect(result).toEqual({ tempHours: 12, tempMinutes: 2, tempSeconds: 3 });
	});

	it('adjustInput: selectionStart 1 removes middle char', () => {
		// given
		const { doAdjustTimeInputOnChange } = useAdjustTimeInputOnChange();
		const event = { target: { value: '123', selectionStart: 1 } } as React.ChangeEvent<HTMLInputElement>;

		// when
		const result = doAdjustTimeInputOnChange(event, baseStopwatch, TimeUnit.HOURS);

		// then
		expect(result).toEqual({ tempHours: 13, tempMinutes: 2, tempSeconds: 3 });
	});

	it('adjustInput: selectionStart 2 removes last char', () => {
		// given
		const { doAdjustTimeInputOnChange } = useAdjustTimeInputOnChange();
		const event = { target: { value: '123', selectionStart: 2 } } as React.ChangeEvent<HTMLInputElement>;

		// when
		const result = doAdjustTimeInputOnChange(event, baseStopwatch, TimeUnit.HOURS);

		// then
		expect(result).toEqual({ tempHours: 12, tempMinutes: 2, tempSeconds: 3 });
	});

	it('minutes case: updates minutes correctly', () => {
		// given
		const { doAdjustTimeInputOnChange } = useAdjustTimeInputOnChange();
		const event = { target: { value: '45', selectionStart: 0 } } as React.ChangeEvent<HTMLInputElement>;

		// when
		const result = doAdjustTimeInputOnChange(event, baseStopwatch, TimeUnit.MINUTES);

		// then
		expect(result).toEqual({ tempHours: 1, tempMinutes: 45, tempSeconds: 3 });
	});

	it('seconds case: updates seconds correctly', () => {
		// given
		const { doAdjustTimeInputOnChange } = useAdjustTimeInputOnChange();
		const event = { target: { value: '59', selectionStart: 0 } } as React.ChangeEvent<HTMLInputElement>;

		// when
		const result = doAdjustTimeInputOnChange(event, baseStopwatch, TimeUnit.SECONDS);

		// then
		expect(result).toEqual({ tempHours: 1, tempMinutes: 2, tempSeconds: 59 });
	});

	it('hours returns undefined when > 99', () => {
		// given
		const { doAdjustTimeInputOnChange } = useAdjustTimeInputOnChange();
		const event = { target: { value: '100', selectionStart: 0 } } as React.ChangeEvent<HTMLInputElement>;

		// when
		const result = doAdjustTimeInputOnChange(event, baseStopwatch, TimeUnit.HOURS);

		// then
		expect(result).toBeUndefined();
	});

	it('minutes returns undefined when > 59', () => {
		// given
		const { doAdjustTimeInputOnChange } = useAdjustTimeInputOnChange();
		const event = { target: { value: '60', selectionStart: 0 } } as React.ChangeEvent<HTMLInputElement>;

		// when
		const result = doAdjustTimeInputOnChange(event, baseStopwatch, TimeUnit.MINUTES);

		// then
		expect(result).toBeUndefined();
	});

	it('seconds returns undefined when > 59', () => {
		// given
		const { doAdjustTimeInputOnChange } = useAdjustTimeInputOnChange();
		const event = { target: { value: '60', selectionStart: 0 } } as React.ChangeEvent<HTMLInputElement>;

		// when
		const result = doAdjustTimeInputOnChange(event, baseStopwatch, TimeUnit.SECONDS);

		// then
		expect(result).toBeUndefined();
	});
});
