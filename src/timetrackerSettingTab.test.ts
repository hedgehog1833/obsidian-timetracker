import { Setting } from 'obsidian';
import { TimetrackerSettingTab } from './timetrackerSettingTab';

type TestSetting = Setting & {
	triggerToggle(value: boolean): void;
	triggerText(value: string): void;
	triggerColor(value: string): void;
	clickButton(): void;
};

describe('TimetrackerSettingTab (unit tests)', () => {
	let pluginMock: any;
	let tab: TimetrackerSettingTab;
	let definitions: any;

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
		definitions = tab.getSettingDefinitions();
	});

	const formattingItem = (name: string): any => {
		const formatting = definitions.find(
			(definition: any) => definition.type === 'group' && definition.heading === 'Formatting',
		) as any;

		return formatting.items.find((item: any) => item.name === name);
	};

	const createSetting = (): TestSetting => new Setting(tab.containerEl) as TestSetting;

	it('defines and saves show hours changes', async () => {
		const setting = createSetting();
		const showHours = formattingItem('Show hours');

		expect(showHours).toMatchObject({
			name: 'Show hours',
			desc: 'Show hours in the inserted timestamp.',
		});

		showHours.render(setting);
		await setting.triggerToggle(false);

		expect(pluginMock.settings.showHours).toBe(false);
		expect(pluginMock.saveSettings).toHaveBeenCalledTimes(1);
	});

	it('defines and saves show minutes changes', async () => {
		const setting = createSetting();
		const showMinutes = formattingItem('Show minutes');

		expect(showMinutes).toMatchObject({
			name: 'Show minutes',
			desc: 'Show minutes in the inserted timestamp.',
		});

		showMinutes.render(setting);
		await setting.triggerToggle(false);

		expect(pluginMock.settings.showMinutes).toBe(false);
		expect(pluginMock.saveSettings).toHaveBeenCalledTimes(1);
	});

	it('defines and saves show seconds changes', async () => {
		const setting = createSetting();
		const showSeconds = formattingItem('Show seconds');

		expect(showSeconds).toMatchObject({
			name: 'Show seconds',
			desc: 'Show seconds in the inserted timestamp.',
		});

		showSeconds.render(setting);
		await setting.triggerToggle(true);

		expect(pluginMock.settings.showSeconds).toBe(true);
		expect(pluginMock.saveSettings).toHaveBeenCalledTimes(1);
	});

	it('defines trimming toggle', () => {
		const formatting = definitions.find(
			(definition: any) => definition.type === 'group' && definition.heading === 'Formatting',
		);

		expect(formatting).toBeDefined();

		const items = formatting?.items ?? [];
		const trimming = items.find((item: any) => item.name === 'Trimming');

		expect(trimming).toMatchObject({
			name: 'Trimming',
			desc: 'Remove leading zeros.',
			control: {
				type: 'toggle',
				key: 'trimLeadingZeros',
				defaultValue: false,
			},
		});
	});

	it('defines line break toggle', () => {
		const formatting = definitions.find(
			(definition: any) => definition.type === 'group' && definition.heading === 'Formatting',
		);

		expect(formatting).toBeDefined();

		const items = formatting?.items ?? [];
		const lineBreak = items.find((item: any) => item.name === 'Line break');

		expect(lineBreak).toMatchObject({
			name: 'Line break',
			desc: 'Add a line break after the inserted timestamp.',
			control: {
				type: 'toggle',
				key: 'lineBreakAfterInsert',
				defaultValue: false,
			},
		});
	});

	it('persistence toggle updates settings and triggers save layout when enabled', async () => {
		const miscellaneous = definitions.find(
			(definition: any) => definition.type === 'group' && definition.heading === 'Miscellaneous',
		) as any;

		const persistence = miscellaneous.items.find((item: any) => item.name === 'Persistence');
		const setting = createSetting();

		persistence.render(setting);
		await setting.triggerToggle(true);

		expect(pluginMock.settings.persistTimerValue).toBe(true);
		expect(pluginMock.saveSettings).toHaveBeenCalledTimes(1);
		expect(tab.app.workspace.requestSaveLayout).toHaveBeenCalledTimes(1);
	});

	it('handles valid and invalid printed time formats', async () => {
		const formatting = definitions.find(
			(definition: any) => definition.type === 'group' && definition.heading === 'Formatting',
		) as any;

		const printedTimeFormat = formatting.items.find((item: any) => item.name === 'Printed time format');
		const setting = createSetting();

		printedTimeFormat.render(setting);

		setting.triggerText('${hours}h');
		await Promise.resolve();

		expect(pluginMock.settings.printFormat).toBe('${hours}h');
		expect(pluginMock.saveSettings).toHaveBeenCalledTimes(1);

		setting.triggerText('no placeholders');
		await Promise.resolve();

		expect(pluginMock.settings.printFormat).toBe('${hours}h');
		expect(pluginMock.saveSettings).toHaveBeenCalledTimes(1);
	});

	it('reset to default color sets default color and saves', async () => {
		const formatting = definitions.find(
			(definition: any) => definition.type === 'group' && definition.heading === 'Formatting',
		) as any;

		const textColor = formatting.items.find((item: any) => item.name === 'Text color');
		const setting = createSetting();

		tab.containerEl.style.color = 'rgb(1, 2, 3)';
		textColor.render(setting);

		setting.clickButton();
		await Promise.resolve();

		expect(pluginMock.settings.textColor).toBe('#010203');
		expect(pluginMock.saveSettings).toHaveBeenCalledTimes(1);
	});

	it('defines the formatting toggles', () => {
		const formatting = definitions.find(
			(definition: any) => definition.type === 'group' && definition.heading === 'Formatting',
		);

		expect(formatting).toBeDefined();

		const names = formatting?.items.map((item: any) => item.name) ?? [];

		expect(names).toEqual(expect.arrayContaining(['Show hours', 'Show minutes', 'Show seconds']));
	});

	it('prevents disabling all units and does not save when attempted for hours', async () => {
		pluginMock.settings.showMinutes = false;
		pluginMock.settings.showSeconds = false;

		const formatting = definitions.find(
			(definition: any) => definition.type === 'group' && definition.heading === 'Formatting',
		) as any;

		const showHours = formatting.items.find((item: any) => item.name === 'Show hours');
		const setting = createSetting();

		showHours.render(setting);
		await setting.triggerToggle(false);

		expect(pluginMock.settings.showHours).toBe(true);
		expect(pluginMock.saveSettings).not.toHaveBeenCalled();
	});

	it('prevents disabling all units and does not save when attempted for minutes', async () => {
		pluginMock.settings.showHours = false;
		pluginMock.settings.showSeconds = false;

		const formatting = definitions.find(
			(definition: any) => definition.type === 'group' && definition.heading === 'Formatting',
		) as any;

		const showMinutes = formatting.items.find((item: any) => item.name === 'Show minutes');
		const setting = createSetting();

		showMinutes.render(setting);
		await setting.triggerToggle(false);

		expect(pluginMock.settings.showMinutes).toBe(true);
		expect(pluginMock.saveSettings).not.toHaveBeenCalled();
	});

	it('prevents disabling all units and does not save when attempted for seconds', async () => {
		pluginMock.settings.showHours = false;
		pluginMock.settings.showMinutes = false;

		const formatting = definitions.find(
			(definition: any) => definition.type === 'group' && definition.heading === 'Formatting',
		) as any;

		const showSeconds = formatting.items.find((item: any) => item.name === 'Show seconds');
		const setting = createSetting();

		showSeconds.render(setting);
		await setting.triggerToggle(false);

		expect(pluginMock.settings.showSeconds).toBe(true);
		expect(pluginMock.saveSettings).not.toHaveBeenCalled();
	});

	it('color setter updates plugin settings and calls saveSettings', async () => {
		const formatting = definitions.find(
			(definition: any) => definition.type === 'group' && definition.heading === 'Formatting',
		) as any;

		const textColor = formatting.items.find((item: any) => item.name === 'Text color');
		const setting = createSetting();

		textColor.render(setting);
		setting.triggerColor('#00ff00');
		await Promise.resolve();

		expect(pluginMock.settings.textColor).toBe('#00ff00');
		expect(pluginMock.saveSettings).toHaveBeenCalledTimes(1);
	});
});
