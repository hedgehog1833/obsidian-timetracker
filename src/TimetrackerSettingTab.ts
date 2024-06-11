import { App, PluginSettingTab, Setting } from 'obsidian';
import StopwatchPlugin from './main';

const SETTING_INTERVAL_DESC = 'Valid value range: 1-1000';

export class TimetrackerSettingTab extends PluginSettingTab {
	plugin: StopwatchPlugin;

	constructor(app: App, plugin: StopwatchPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		this.createFormatSetting(containerEl);
		this.createTrimmingSetting(containerEl);
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

	private static parseFormatValue(src: string): string {
		const value = src.trim();
		if (value === null || value === undefined || value.length === 0) {
			throw Error('Value should not be empty');
		}
		return value;
	}

	private static showFormatAlert(setting: Setting, message: string) {
		setting.descEl.empty();
		const container = setting.descEl.createDiv();
		const note = setting.descEl.createDiv();
		note.setText(SETTING_INTERVAL_DESC);
		const alert = setting.descEl.createDiv({
			cls: 'settings-format-alert',
		});
		alert.setText(message);
		container.appendChild(note);
		container.appendChild(alert);
	}
}
