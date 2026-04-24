import format from './formatter';

describe('formatter', () => {
	const ms = (h: number, m: number, s: number) => h * 60 * 60 * 1000 + m * 60 * 1000 + s * 1000;

	it('formats zero as 00:00:00', () => {
		// when
		const value = format(0);

		// then
		expect(value).toBe('00:00:00');
	});

	it('formats 1h30m as 01:30:00', () => {
		// when
		const value = format(ms(1, 30, 0));

		// then
		expect(value).toBe('01:30:00');
	});

	it('formats large hours without losing precision', () => {
		// when
		const value = format(ms(90, 0, 0));

		// then
		expect(value).toBe('90:00:00');
	});
});
