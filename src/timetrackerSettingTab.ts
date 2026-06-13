import { App, ColorComponent, PluginSettingTab, Setting } from 'obsidian';
import StopwatchPlugin from './main';
import { rgbToHex } from './printHelpers';

export class TimetrackerSettingTab extends PluginSettingTab {
	static PRINT_FORMAT_MAX_LENGTH = 255;
	static PRINT_FORMAT_DESCRIPTION =
		'Use the following placeholders: ${hours}, ${minutes}, ${seconds}.<br/>Trimming still applies.';
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

	display(): void {
		this.containerEl.empty();

		new Setting(this.containerEl).setName('Formatting').setHeading();
		this.createStopwatchFormatSetting();
		this.createTrimmingSetting();
		this.createLineBreakSetting();
		this.createTextColorSetting();
		this.createPrintFormatSetting();

		new Setting(this.containerEl).setName('Miscellaneous').setHeading();
		this.createPersistenceSetting();
	}

	private createStopwatchFormatSetting(): void {
		const hoursSetting = new Setting(this.containerEl).setName('Show hours').addToggle((component) => {
			component.setValue(this.plugin.settings.showHours).onChange(async (value) => {
				if (!value && !this.plugin.settings.showMinutes && !this.plugin.settings.showSeconds) {
					component.setValue(true);
					hoursSetting.setDesc(TimetrackerSettingTab.FORMAT_ERROR_MESSAGE);
				} else {
					this.clearFormatErrorMessages();
					this.plugin.settings.showHours = value;
					await this.plugin.saveSettings();
				}
			});
		});
		this.hoursSetting = hoursSetting;

		const minutesSetting = new Setting(this.containerEl).setName('Show minutes').addToggle((component) => {
			component.setValue(this.plugin.settings.showMinutes).onChange(async (value) => {
				if (!value && !this.plugin.settings.showHours && !this.plugin.settings.showSeconds) {
					component.setValue(true);
					minutesSetting.setDesc(TimetrackerSettingTab.FORMAT_ERROR_MESSAGE);
				} else {
					this.clearFormatErrorMessages();
					this.plugin.settings.showMinutes = value;
					await this.plugin.saveSettings();
				}
			});
		});
		this.minutesSetting = minutesSetting;

		const secondsSetting = new Setting(this.containerEl).setName('Show seconds').addToggle((component) => {
			component.setValue(this.plugin.settings.showSeconds).onChange(async (value) => {
				if (!value && !this.plugin.settings.showHours && !this.plugin.settings.showMinutes) {
					component.setValue(true);
					secondsSetting.setDesc(TimetrackerSettingTab.FORMAT_ERROR_MESSAGE);
				} else {
					this.clearFormatErrorMessages();
					this.plugin.settings.showSeconds = value;
					await this.plugin.saveSettings();
				}
			});
		});
		this.secondsSetting = secondsSetting;
	}

	private createTrimmingSetting(): void {
		new Setting(this.containerEl)
			.setName('Trimming')
			.setDesc('Remove leading zeros.')
			.addToggle((component) => {
				component.setValue(this.plugin.settings.trimLeadingZeros).onChange(async (value) => {
					this.plugin.settings.trimLeadingZeros = value;
					await this.plugin.saveSettings();
				});
			});
	}

	private createLineBreakSetting(): void {
		new Setting(this.containerEl)
			.setName('Line break')
			.setDesc('Add a line break after the inserted timestamp.')
			.addToggle((component) => {
				component.setValue(this.plugin.settings.lineBreakAfterInsert).onChange(async (value) => {
					this.plugin.settings.lineBreakAfterInsert = value;
					await this.plugin.saveSettings();
				});
			});
	}

	private createTextColorSetting(): void {
		new Setting(this.containerEl)
			.setName('Text color')
			.setDesc("Set the inserted timestamp's text color.")
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
	}

	private createPrintFormatSetting(): void {
		const setting = new Setting(this.containerEl).setName('Printed time format').addText((component) => {
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
	}

	private createPersistenceSetting(): void {
		new Setting(this.containerEl)
			.setName('Persistence')
			.setDesc('Persist time value and restore after restart.')
			.addToggle((component) => {
				component.setValue(this.plugin.settings.persistTimerValue).onChange(async (value) => {
					this.plugin.settings.persistTimerValue = value;
					await this.plugin.saveSettings();

					if (this.plugin.settings.persistTimerValue) {
						this.app.workspace.requestSaveLayout();
					}
				});
			});
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
