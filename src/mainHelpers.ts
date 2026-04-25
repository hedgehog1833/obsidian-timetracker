import { TimetrackerSettings } from './main';
import { loadFirstTextColor } from './printHelpers';

export const migrateFormat = (settings: TimetrackerSettings): boolean => {
	if (settings?.format != null && settings.format.length > 0) {
		settings.showHours = settings.format.includes('H') || settings.format.includes('h');
		settings.showMinutes = settings.format.includes('M') || settings.format.includes('m');
		settings.showSeconds = settings.format.includes('S') || settings.format.includes('s');
		settings.format = null;
		settings.interval = null;
		return true;
	}
	return false;
};

export const migrate = (loadedSettings: TimetrackerSettings): boolean => {
	const isFormatMigrated = migrateFormat(loadedSettings);
	const isFirstTextColorLoaded = loadFirstTextColor(loadedSettings);
	return isFormatMigrated || isFirstTextColorLoaded;
};
