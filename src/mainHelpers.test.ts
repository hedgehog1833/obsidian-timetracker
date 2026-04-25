import { migrate, migrateFormat } from './mainHelpers';

describe('mainHelpers', () => {
	it('migrateFormat moves flags and clears format', () => {
		// given
		const settings: any = { format: 'HMS', interval: 5 };

		// when
		const changed = migrateFormat(settings);

		// then
		expect(changed).toBe(true);
		expect(settings.format).toBeNull();
		expect(settings.interval).toBeNull();
		expect(settings.showHours).toBe(true);
		expect(settings.showMinutes).toBe(true);
		expect(settings.showSeconds).toBe(true);
	});

	it('migrateFormat returns false when no format', () => {
		// given
		const settings: any = {};

		// when
		const result = migrateFormat(settings);

		// then
		expect(result).toBe(false);
	});

	it('migrate returns true when format is migrated', () => {
		// given
		const settings: any = { format: 'HMS', interval: 5, textColor: '#ffffff' };

		// when
		const changed = migrate(settings as any);

		// then
		expect(changed).toBe(true);
		expect(settings.format).toBeNull();
		expect(settings.interval).toBeNull();
		expect(settings.showHours).toBe(true);
	});

	it('migrate returns true when first text color is loaded', () => {
		// given
		const settings: any = { textColor: '' };

		// when
		const changed = migrate(settings as any);

		// then
		expect(changed).toBe(true);
		expect(settings.textColor).toBe('#dadada');
	});

	it('migrate returns false when nothing to migrate', () => {
		// given
		const settings: any = { textColor: '#abc' };

		// when
		const changed = migrate(settings as any);

		// then
		expect(changed).toBe(false);
	});
});
