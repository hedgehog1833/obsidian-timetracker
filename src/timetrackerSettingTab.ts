import { App, ColorComponent, PluginSettingTab, Setting } from 'obsidian';
import StopwatchPlugin from './main';

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

		this.containerEl.createEl('h2', { text: 'Formatting' });
		this.createStopwatchFormatSetting();
		this.createTrimmingSetting();
		this.createLineBreakSetting();
		this.createTextColorSetting();
		this.createPrintFormatSetting();

		this.containerEl.createEl('h2', { text: 'Miscellaneous' });
		this.createPersistenceSetting();
	}

	private createStopwatchFormatSetting(): void {
		const hoursSetting = new Setting(this.containerEl).setName('Show hours').addToggle((component) => {
			component
				.setValue(this.plugin.settings.showHours)
				.setDisabled(this.plugin.settings.printFormat.length > 0)
				.onChange(async (value) => {
					if (!value && !this.plugin.settings.showMinutes && !this.plugin.settings.showSeconds) {
						component.setValue(true);
						hoursSetting.descEl.innerHTML = TimetrackerSettingTab.FORMAT_ERROR_MESSAGE;
					} else {
						this.clearFormatErrorMessages();
						this.plugin.settings.showHours = value;
						await this.plugin.saveSettings();
					}
				});
		});
		this.hoursSetting = hoursSetting;

		const minutesSetting = new Setting(this.containerEl).setName('Show minutes').addToggle((component) => {
			component
				.setValue(this.plugin.settings.showMinutes)
				.setDisabled(this.plugin.settings.printFormat.length > 0)
				.onChange(async (value) => {
					if (!value && !this.plugin.settings.showHours && !this.plugin.settings.showSeconds) {
						component.setValue(true);
						minutesSetting.descEl.innerHTML = TimetrackerSettingTab.FORMAT_ERROR_MESSAGE;
					} else {
						this.clearFormatErrorMessages();
						this.plugin.settings.showMinutes = value;
						await this.plugin.saveSettings();
					}
				});
		});
		this.minutesSetting = minutesSetting;

		const secondsSetting = new Setting(this.containerEl).setName('Show seconds').addToggle((component) => {
			component
				.setValue(this.plugin.settings.showSeconds)
				.setDisabled(this.plugin.settings.printFormat.length > 0)
				.onChange(async (value) => {
					if (!value && !this.plugin.settings.showHours && !this.plugin.settings.showMinutes) {
						component.setValue(true);
						secondsSetting.descEl.innerHTML = TimetrackerSettingTab.FORMAT_ERROR_MESSAGE;
					} else {
						this.clearFormatErrorMessages();
						this.plugin.settings.showSeconds = value;
						await this.plugin.saveSettings();
					}
				});
		});
		this.secondsSetting = secondsSetting;

		this.toggleStopwatchFormatSettings(this.plugin.settings.printFormat.length <= 0);
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
					const defaultColor = this.plugin.rgbToHex(style?.color);
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
						setting.descEl.innerHTML = TimetrackerSettingTab.PRINT_FORMAT_DESCRIPTION;
						await this.plugin.saveSettings();

						const formatTogglesEnabled = this.plugin.settings.printFormat.length <= 0;
						this.hoursSetting?.components.first()?.setDisabled(!formatTogglesEnabled);
						this.minutesSetting?.components.first()?.setDisabled(!formatTogglesEnabled);
						this.secondsSetting?.components.first()?.setDisabled(!formatTogglesEnabled);
						this.toggleStopwatchFormatSettings(formatTogglesEnabled);
					} else {
						setting.descEl.innerHTML = `Invalid print format! Max length is ${TimetrackerSettingTab.PRINT_FORMAT_MAX_LENGTH} and at least one placeholder has to be in use.`;
					}
				});
		});
		setting.descEl.innerHTML = TimetrackerSettingTab.PRINT_FORMAT_DESCRIPTION;
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
			((printFormat.contains('${hours}') || printFormat.contains('${minutes}') || printFormat.contains('${seconds}')) &&
				printFormat.length <= TimetrackerSettingTab.PRINT_FORMAT_MAX_LENGTH)
		);
	}

	private toggleStopwatchFormatSettings(formatTogglesEnabled: boolean): void {
		if (formatTogglesEnabled) {
			if (this.hoursSetting) {
				this.hoursSetting.nameEl.style.opacity = '1';
				this.hoursSetting.controlEl.style.opacity = '1';
			}
			if (this.minutesSetting) {
				this.minutesSetting.nameEl.style.opacity = '1';
				this.minutesSetting.controlEl.style.opacity = '1';
			}
			if (this.secondsSetting) {
				this.secondsSetting.nameEl.style.opacity = '1';
				this.secondsSetting.controlEl.style.opacity = '1';
			}
		} else {
			if (this.hoursSetting) {
				this.hoursSetting.nameEl.style.opacity = '0.5';
				this.hoursSetting.controlEl.style.opacity = '0.5';
			}
			if (this.minutesSetting) {
				this.minutesSetting.nameEl.style.opacity = '0.5';
				this.minutesSetting.controlEl.style.opacity = '0.5';
			}
			if (this.secondsSetting) {
				this.secondsSetting.nameEl.style.opacity = '0.5';
				this.secondsSetting.controlEl.style.opacity = '0.5';
			}
		}
	}

	private clearFormatErrorMessages(): void {
		if (this.hoursSetting) {
			this.hoursSetting.descEl.innerHTML = '';
		}
		if (this.minutesSetting) {
			this.minutesSetting.descEl.innerHTML = '';
		}
		if (this.secondsSetting) {
			this.secondsSetting.descEl.innerHTML = '';
		}
	}
}
