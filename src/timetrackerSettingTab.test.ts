import { TimetrackerSettingTab } from './timetrackerSettingTab';

describe('TimetrackerSettingTab (unit tests)', () => {
	let pluginMock: any;
	let tab: TimetrackerSettingTab;

	beforeEach(() => {
		pluginMock = {
			settings: {
				showHours: true,
				showMinutes: true,
				showSeconds: true,
				trimLeadingZeros: false,
				lineBreakAfterInsert: false,
				textColor: '',
				printFormat: '',
				persistTimerValue: false,
			},
			saveSettings: jest.fn(),
		};

		const appMock: any = { workspace: { requestSaveLayout: jest.fn() } };
		tab = new TimetrackerSettingTab(appMock as any, pluginMock);
	});

	it('toggling show hours/minutes/seconds updates settings and calls saveSettings', () => {
		// given
		tab.display();

		// when
		(tab.hoursSetting as any)!.triggerToggle(false);
		(tab.minutesSetting as any)!.triggerToggle(false);
		(tab.secondsSetting as any)!.triggerToggle(true);

		// then
		expect(pluginMock.settings.showHours).toBe(false);
		expect(pluginMock.settings.showMinutes).toBe(false);
		expect(pluginMock.settings.showSeconds).toBe(true);
		expect(pluginMock.saveSettings).toHaveBeenCalledTimes(3);
	});

	it('trimming and line break toggles update settings and call saveSettings', () => {
		// when
		tab.display();

		// find trimming setting instance via DOM
		const trimmingName = Array.from(tab.containerEl.querySelectorAll('.setting-name')).find(
			(n: any) => n.textContent === 'Trimming',
		);
		const trimmingSetting = (trimmingName as any)?.parentElement?._setting as any;
		trimmingSetting.triggerToggle(true);
		const lineBreakName = Array.from(tab.containerEl.querySelectorAll('.setting-name')).find(
			(n: any) => n.textContent === 'Line break',
		);
		const lineBreakSetting = (lineBreakName as any)?.parentElement?._setting as any;
		lineBreakSetting.triggerToggle(true);

		// then
		expect(pluginMock.settings.trimLeadingZeros).toBe(true);
		expect(pluginMock.settings.lineBreakAfterInsert).toBe(true);
		// two additional saveSettings calls
		expect(pluginMock.saveSettings).toHaveBeenCalled();
	});

	it('persistence toggle updates settings and triggers save layout when enabled', async () => {
		// given
		tab.display();
		const persistenceName = Array.from(tab.containerEl.querySelectorAll('.setting-name')).find(
			(n: any) => n.textContent === 'Persistence',
		);
		const persistenceSetting = (persistenceName as any)?.parentElement?._setting as any;

		// when
		persistenceSetting.triggerToggle(true);
		await Promise.resolve();

		// then
		expect(pluginMock.settings.persistTimerValue).toBe(true);
		expect(pluginMock.saveSettings).toHaveBeenCalled();
		expect((tab as any).app.workspace.requestSaveLayout).toHaveBeenCalled();
	});

	it('printed time format valid/invalid handling', () => {
		// given
		tab.display();
		const printName = Array.from(tab.containerEl.querySelectorAll('.setting-name')).find(
			(n: any) => n.textContent === 'Printed time format',
		);
		const printSetting = (printName as any)?.parentElement?._setting as any;

		// when
		printSetting.triggerText('${hours}h');

		// then
		expect(pluginMock.settings.printFormat).toBe('${hours}h');
		expect(pluginMock.saveSettings).toHaveBeenCalled();

		// when
		printSetting.triggerText('no placeholders');

		// then
		expect(printSetting.descEl.innerHTML).toContain('Invalid print format');
	});

	it('reset to default color button sets default color and saves', () => {
		// given
		tab.display();
		tab.containerEl.style.color = 'rgb(1,2,3)';

		const textColorName = Array.from(tab.containerEl.querySelectorAll('.setting-name')).find(
			(n: any) => n.textContent === 'Text color',
		);
		const textColorSetting = (textColorName as any)?.parentElement?._setting as any;

		// when
		textColorSetting.clickButton();

		// then
		expect(pluginMock.settings.textColor).toBe('#010203');
		expect(pluginMock.saveSettings).toHaveBeenCalled();
	});

	it('display builds settings and exposes hours/minutes/seconds settings', () => {
		// when
		tab.display();

		// then
		expect(tab.containerEl.querySelector('h2')?.textContent).toBe('Formatting');
		expect(tab.hoursSetting).toBeDefined();
		expect(tab.minutesSetting).toBeDefined();
		expect(tab.secondsSetting).toBeDefined();
	});

	it('prevents disabling all units and shows format error message for hours', () => {
		// given
		pluginMock.settings.showMinutes = false;
		pluginMock.settings.showSeconds = false;

		// when
		tab.display();
		(tab.hoursSetting as any)!.triggerToggle(false);

		// then
		expect(tab.hoursSetting!.descEl.innerHTML).toContain(
			'At least one of hours, minutes or seconds must be enabled.',
		);
		expect(pluginMock.saveSettings).not.toHaveBeenCalled();
	});

	it('prevents disabling all units and shows format error message for minutes', () => {
		// given
		pluginMock.settings.showHours = false;
		pluginMock.settings.showSeconds = false;

		// when
		tab.display();
		(tab.minutesSetting as any)!.triggerToggle(false);

		// then
		expect(tab.minutesSetting!.descEl.innerHTML).toContain(
			'At least one of hours, minutes or seconds must be enabled.',
		);
		expect(pluginMock.saveSettings).not.toHaveBeenCalled();
	});

	it('prevents disabling all units and shows format error message for seconds', () => {
		// given
		pluginMock.settings.showHours = false;
		pluginMock.settings.showMinutes = false;

		// when
		tab.display();
		(tab.secondsSetting as any)!.triggerToggle(false);

		// then
		expect(tab.secondsSetting!.descEl.innerHTML).toContain(
			'At least one of hours, minutes or seconds must be enabled.',
		);
		expect(pluginMock.saveSettings).not.toHaveBeenCalled();
	});

	it('color picker onChange updates plugin settings and calls saveSettings', () => {
		// given
		tab.display();

		// when
		(tab as any).colorPickerInstance?._set?.('#00ff00');

		// then
		expect(pluginMock.settings.textColor).toBe('#00ff00');
		expect(pluginMock.saveSettings).toHaveBeenCalled();
	});
});
