import { App, ColorComponent, PluginSettingTab, Setting } from 'obsidian';
import StopwatchPlugin from './main';

export class TimetrackerSettingTab extends PluginSettingTab {
	plugin: StopwatchPlugin;
	colorPickerInstance?: ColorComponent;

	constructor(app: App, plugin: StopwatchPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		this.createFormatSetting(containerEl);
		this.createTrimmingSetting(containerEl);
		this.createLineBreakSetting(containerEl);
		this.createTextColorSetting(containerEl);
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
			.setDesc('Remove leading zeros')
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
			.setDesc('Add a line break after the inserted timestamp')
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
			.setDesc("Set the timestamp's text color")
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
					this.colorPickerInstance?.setValue('');
					this.plugin.settings.textColor = '';
					await this.plugin.saveSettings();
				});
			});
	}
}
