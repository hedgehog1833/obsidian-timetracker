import { App, ColorComponent, PluginSettingTab, Setting, type SettingDefinitionItem } from 'obsidian';
import StopwatchPlugin from './main';
import { rgbToHex } from './printHelpers';

export class TimetrackerSettingTab extends PluginSettingTab {
	static PRINT_FORMAT_MAX_LENGTH = 255;
	static PRINT_FORMAT_DESCRIPTION =
		'Use the following placeholders: ${hours}, ${minutes}, ${seconds}. Trimming still applies.';
	static FORMAT_ERROR_MESSAGE = 'At least one of hours, minutes or seconds must be enabled.';

	plugin: StopwatchPlugin;
	colorPickerInstance?: ColorComponent;
	hoursSetting?: Setting;
	minutesSetting?: Setting;
	secondsSetting?: Setting;

	constructor(app: App, plugin: StopwatchPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	getSettingDefinitions(): SettingDefinitionItem[] {
		return [
			{
				type: 'group',
				heading: 'Formatting',
				items: [
					{
						name: 'Show hours',
						desc: 'Show hours in the inserted timestamp.',
						render: (setting: Setting) => {
							setting.addToggle((component) => {
								component.setValue(this.plugin.settings.showHours).onChange(async (value) => {
									if (!value && !this.plugin.settings.showMinutes && !this.plugin.settings.showSeconds) {
										component.setValue(true);
										this.hoursSetting?.setDesc(TimetrackerSettingTab.FORMAT_ERROR_MESSAGE);
									} else {
										this.clearFormatErrorMessages();
										this.plugin.settings.showHours = value;
										await this.plugin.saveSettings();
									}
								});
							});
							this.hoursSetting = setting;
						},
					},
					{
						name: 'Show minutes',
						desc: 'Show minutes in the inserted timestamp.',
						render: (setting: Setting) => {
							setting.addToggle((component) => {
								component.setValue(this.plugin.settings.showMinutes).onChange(async (value) => {
									if (!value && !this.plugin.settings.showHours && !this.plugin.settings.showSeconds) {
										component.setValue(true);
										this.minutesSetting?.setDesc(TimetrackerSettingTab.FORMAT_ERROR_MESSAGE);
									} else {
										this.clearFormatErrorMessages();
										this.plugin.settings.showMinutes = value;
										await this.plugin.saveSettings();
									}
								});
							});
							this.minutesSetting = setting;
						},
					},
					{
						name: 'Show seconds',
						desc: 'Show seconds in the inserted timestamp.',
						render: (setting: Setting) => {
							setting.addToggle((component) => {
								component.setValue(this.plugin.settings.showSeconds).onChange(async (value) => {
									if (!value && !this.plugin.settings.showHours && !this.plugin.settings.showMinutes) {
										component.setValue(true);
										this.secondsSetting?.setDesc(TimetrackerSettingTab.FORMAT_ERROR_MESSAGE);
									} else {
										this.clearFormatErrorMessages();
										this.plugin.settings.showSeconds = value;
										await this.plugin.saveSettings();
									}
								});
							});
							this.secondsSetting = setting;
						},
					},
					{
						name: 'Trimming',
						desc: 'Remove leading zeros.',
						control: { type: 'toggle', key: 'trimLeadingZeros', defaultValue: false },
					},
					{
						name: 'Line break',
						desc: 'Add a line break after the inserted timestamp.',
						control: { type: 'toggle', key: 'lineBreakAfterInsert', defaultValue: false },
					},
					{
						name: 'Text color',
						desc: "Set the inserted timestamp's text color.",
						render: (setting: Setting) => {
							setting
								.addColorPicker((component) => {
									component.setValue(this.plugin.settings.textColor).onChange(async (value) => {
										this.plugin.settings.textColor = value;
										await this.plugin.saveSettings();
									});
									this.colorPickerInstance = component;
								})
								.addButton((component) => {
									component.setButtonText('Reset to default');
									component.onClick(async (_) => {
										const style = window.getComputedStyle(this.containerEl);
										const defaultColor = rgbToHex(style?.color);
										this.colorPickerInstance?.setValue(defaultColor);
										this.plugin.settings.textColor = defaultColor;
										await this.plugin.saveSettings();
									});
								});
						},
					},
					{
						name: 'Printed time format',
						desc: TimetrackerSettingTab.PRINT_FORMAT_DESCRIPTION,
						render: (setting: Setting) => {
							setting.addText((component) => {
								component
									.setValue(this.plugin.settings.printFormat)
									.setPlaceholder('${hours} hours and ${minutes} minutes')
									.onChange(async (value) => {
										if (this.printFormatIsValid(value)) {
											this.plugin.settings.printFormat = value.trim().length === 0 && value.length !== 0 ? '' : value;
											setting.setDesc(TimetrackerSettingTab.PRINT_FORMAT_DESCRIPTION);
											await this.plugin.saveSettings();
										} else {
											setting.setDesc(
												`Invalid print format! Max length is ${TimetrackerSettingTab.PRINT_FORMAT_MAX_LENGTH} and at least one placeholder has to be in use.`,
											);
										}
									});
							});
							setting.setDesc(TimetrackerSettingTab.PRINT_FORMAT_DESCRIPTION);
						},
					},
				],
			},
			{
				type: 'group',
				heading: 'Miscellaneous',
				items: [
					{
						name: 'Persistence',
						desc: 'Persist time value and restore after restart.',
						render: (setting: Setting) => {
							setting.addToggle((component) => {
								component.setValue(this.plugin.settings.persistTimerValue).onChange(async (value) => {
									this.plugin.settings.persistTimerValue = value;
									await this.plugin.saveSettings();

									if (this.plugin.settings.persistTimerValue) {
										this.app.workspace.requestSaveLayout();
									}
								});
							});
						},
					},
				],
			},
		];
	}

	private printFormatIsValid(printFormat: string): boolean {
		return (
			printFormat.length === 0 ||
			((printFormat.includes('${hours}') || printFormat.includes('${minutes}') || printFormat.includes('${seconds}')) &&
				printFormat.length <= TimetrackerSettingTab.PRINT_FORMAT_MAX_LENGTH)
		);
	}

	private clearFormatErrorMessages(): void {
		if (this.hoursSetting) {
			this.hoursSetting.setDesc('');
		}
		if (this.minutesSetting) {
			this.minutesSetting.setDesc('');
		}
		if (this.secondsSetting) {
			this.secondsSetting.setDesc('');
		}
	}
}
