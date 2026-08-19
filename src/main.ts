import { Plugin, WorkspaceLeaf } from 'obsidian';
import { registerCommands } from './commands';
import { migrate } from './mainHelpers';
import { StopwatchController } from './stopwatch/stopwatchController';
import { registerStopwatchRuntime } from './stopwatch/stopwatchRuntime';
import { TimetrackerSettingTab } from './timetrackerSettingTab';
import { TimetrackerView } from './ui/TimetrackerView';

export const TIMETRACKER_VIEW_TYPE = 'timetracker-sidebar';

export interface TimetrackerSettings {
	/** @deprecated custom formats are no longer supported, switches used instead */
	format: string | null;
	/** @deprecated customizing the refresh interval is no longer supported, defaults to 1 second */
	interval: number | null;
	showHours: boolean;
	showMinutes: boolean;
	showSeconds: boolean;
	trimLeadingZeros: boolean;
	lineBreakAfterInsert: boolean;
	textColor: string;
	printFormat: string;
	persistTimerValue: boolean;
}

const DEFAULT_SETTINGS: TimetrackerSettings = {
	format: null,
	interval: null,
	showHours: true,
	showMinutes: true,
	showSeconds: true,
	trimLeadingZeros: false,
	lineBreakAfterInsert: false,
	textColor: '',
	printFormat: '',
	persistTimerValue: false,
};

export default class Timetracker extends Plugin {
	settings: TimetrackerSettings = DEFAULT_SETTINGS;
	stopwatchController: StopwatchController = new StopwatchController();

	async onload() {
		await this.loadSettings();

		this.registerView(TIMETRACKER_VIEW_TYPE, (leaf: WorkspaceLeaf) => {
			return new TimetrackerView(leaf, this.settings, this.stopwatchController);
		});

		registerStopwatchRuntime(this, this.stopwatchController, {
			requestSaveLayout: () => this.app.workspace.requestSaveLayout(),
			isPersistenceEnabled: () => this.settings.persistTimerValue,
		});
		registerCommands(this, this.stopwatchController);

		this.addSettingTab(new TimetrackerSettingTab(this.app, this));
		this.app.workspace.onLayoutReady(this.initLeaf.bind(this));
	}

	onunload() {}

	async loadSettings() {
		const loadedSettings: TimetrackerSettings = await this.loadData();
		const migrated = migrate(loadedSettings);
		this.settings = Object.assign({}, DEFAULT_SETTINGS, loadedSettings);
		if (migrated) {
			await this.saveSettings();
		}
	}

	async saveSettings() {
		await this.saveData(this.settings);
		this.stopwatchController.notify();
	}

	async initLeaf(): Promise<void> {
		let leaf = this.app.workspace.getLeavesOfType(TIMETRACKER_VIEW_TYPE).first();

		if (leaf === undefined) {
			const rightLeaf = this.app.workspace.getRightLeaf(false);
			if (rightLeaf == null) {
				return;
			}
			await rightLeaf.setViewState({ type: TIMETRACKER_VIEW_TYPE });
			leaf = rightLeaf;
		}

		if (this.settings.persistTimerValue) {
			await leaf.loadIfDeferred();
		}
	}
}
