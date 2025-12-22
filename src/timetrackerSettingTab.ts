import { App, ColorComponent, PluginSettingTab, Setting } from 'obsidian';
import StopwatchPlugin from './main';

export class TimetrackerSettingTab extends PluginSettingTab {
	plugin: StopwatchPlugin;
	colorPickerInstance?: ColorComponent;
	static PRINT_FORMAT_MAX_LENGTH = 255;
	static PRINT_FORMAT_DESCRIPTION =
		'Use the following placeholders: ${hours}, ${minutes}, ${seconds}.<br/>Trimming still applies.';

	constructor(app: App, plugin: StopwatchPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'Formatting' });
		this.createFormatSetting(containerEl);
		this.createTrimmingSetting(containerEl);
		this.createLineBreakSetting(containerEl);
		this.createTextColorSetting(containerEl);
		this.createPrintFormatSetting(containerEl);

		containerEl.createEl('h2', { text: 'Miscellaneous' });
		this.createPersistenceSetting(containerEl);
	}

	private createFormatSetting(containerEl: HTMLElement): void {
		new Setting(containerEl).setName('Show hours').addToggle((component) => {
			component.setValue(this.plugin.settings.showHours).onChange(async (value) => {
				this.plugin.settings.showHours = value;
				await this.plugin.saveSettings();
			});
		});
		new Setting(containerEl).setName('Show minutes').addToggle((component) => {
			component.setValue(this.plugin.settings.showMinutes).onChange(async (value) => {
				this.plugin.settings.showMinutes = value;
				await this.plugin.saveSettings();
			});
		});
		new Setting(containerEl).setName('Show seconds').addToggle((component) => {
			component.setValue(this.plugin.settings.showSeconds).onChange(async (value) => {
				this.plugin.settings.showSeconds = value;
				await this.plugin.saveSettings();
			});
		});
	}

	private createTrimmingSetting(containerEl: HTMLElement): void {
		new Setting(containerEl)
			.setName('Trimming')
			.setDesc('Remove leading zeros.')
			.addToggle((component) => {
				component.setValue(this.plugin.settings.trimLeadingZeros).onChange(async (value) => {
					this.plugin.settings.trimLeadingZeros = value;
					await this.plugin.saveSettings();
				});
			});
	}

	private createLineBreakSetting(containerEl: HTMLElement): void {
		new Setting(containerEl)
			.setName('Line break')
			.setDesc('Add a line break after the inserted timestamp.')
			.addToggle((component) => {
				component.setValue(this.plugin.settings.lineBreakAfterInsert).onChange(async (value) => {
					this.plugin.settings.lineBreakAfterInsert = value;
					await this.plugin.saveSettings();
				});
			});
	}

	private createTextColorSetting(containerEl: HTMLElement): void {
		new Setting(containerEl)
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
					const style = window.getComputedStyle(containerEl);
					const defaultColor = this.plugin.rgbToHex(style?.color);
					this.colorPickerInstance?.setValue(defaultColor);
					this.plugin.settings.textColor = defaultColor;
					await this.plugin.saveSettings();
				});
			});
	}

	private createPrintFormatSetting(containerEl: HTMLElement): void {
		const setting = new Setting(containerEl).setName('Printed time format').addText((component) => {
			component
				.setValue(this.plugin.settings.printFormat)
				.setPlaceholder('${hours} hours and ${minutes} minutes')
				.onChange(async (value) => {
					if (this.printFormatIsValid(value)) {
						this.plugin.settings.printFormat = value.trim().length === 0 && value.length !== 0 ? '' : value;
						setting.descEl.innerHTML = TimetrackerSettingTab.PRINT_FORMAT_DESCRIPTION;
						await this.plugin.saveSettings();
					} else {
						setting.descEl.innerHTML = `Invalid print format! Max length is ${TimetrackerSettingTab.PRINT_FORMAT_MAX_LENGTH} and at least one placeholder has to be in use.`;
					}
				});
		});
		setting.descEl.innerHTML = TimetrackerSettingTab.PRINT_FORMAT_DESCRIPTION;
	}

	private createPersistenceSetting(containerEl: HTMLElement): void {
		new Setting(containerEl)
			.setName('Persistence')
			.setDesc('Persist time value and restore after restart.')
			.addToggle((component) => {
				component.setValue(this.plugin.settings.persistTimerValue).onChange(async (value) => {
					this.plugin.settings.persistTimerValue = value;
					await this.plugin.saveSettings();
					if (this.plugin.settings.persistTimerValue === true) {
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
}
