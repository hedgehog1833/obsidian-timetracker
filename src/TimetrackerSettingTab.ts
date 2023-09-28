import { App, PluginSettingTab, Setting } from 'obsidian';
import StopwatchPlugin from '../main';

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

		containerEl.createEl('h2', { text: 'Settings for timetracker plugin.' });

		this.createIntervalSetting(containerEl);
		this.createFormatSetting(containerEl);
	}

	createIntervalSetting(containerEl: HTMLElement): void {
		const setting = new Setting(containerEl)
			.setName('Stopwatch refresh interval')
			.setDesc(SETTING_INTERVAL_DESC)
			.addText((text) =>
				text
					.setPlaceholder('Stopwatch refresh interval')
					.setValue(this.plugin.settings.interval.toString())
					.onChange(async (value) => {
						try {
							const interval = TimetrackerSettingTab.parseIntervalValue(value.trim());
							console.log(`interval set to ${interval}`);
							this.plugin.settings.interval = interval;
							await this.plugin.saveSettings();
							setting.descEl.textContent = SETTING_INTERVAL_DESC;
							// todo nilsd check out if needed
							// const view = this.plugin.getView();
							// if (view != null) {
							// 	view.resetInterval();
							// }
						} catch (e) {
							console.log(e);
							TimetrackerSettingTab.showIntervalAlert(setting, e.toString());
						}
					}),
			);
	}

	private static parseIntervalValue(src: string) {
		const value = src.trim();
		if (!value.match(/^[0-9]+$/)) {
			throw Error('Value should be an integer');
		}
		const i = parseInt(value, 10);
		if (1000 >= i && i > 0) {
			return i;
		} else {
			throw Error('Interval value out of range: ' + i);
		}
	}

	private static showIntervalAlert(setting: Setting, message: string) {
		setting.descEl.empty();
		const container = setting.descEl.createDiv();
		const note = setting.descEl.createDiv();
		note.setText(SETTING_INTERVAL_DESC);
		const alert = setting.descEl.createDiv({
			cls: 'settings-interval-alert',
		});
		alert.setText(message);
		console.log(message);
		container.appendChild(note);
		container.appendChild(alert);
	}

	private createFormatSetting(containerEl: HTMLElement) {
		const setting = new Setting(containerEl).setName('Time format').addText((component) => {
			component
				.setValue(this.plugin.settings.format)
				.setPlaceholder('HH:mm:ss.SSS')
				.onChange(async (value) => {
					this.plugin.settings.format = value;
					await this.plugin.saveSettings();
				});
		});
		setting.descEl.innerHTML =
			'For more syntax, refer to the ' + "<a href='https://day.js.org/docs/en/display/format'>format reference</a>";
	}
}
