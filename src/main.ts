import { MarkdownView, Plugin, WorkspaceLeaf } from 'obsidian';
import { migrate } from './mainHelpers';
import { buildPrintValue } from './printHelpers';
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

	async onload() {
		await this.loadSettings();

		this.registerView(TIMETRACKER_VIEW_TYPE, (leaf: WorkspaceLeaf) => {
			return new TimetrackerView(leaf, this.settings);
		});

		this.app.workspace.onLayoutReady(this.initLeaf.bind(this));

		this.addCommand({
			id: 'insert-timestamp',
			name: 'Insert timestamp based on current stopwatch value',
			icon: 'alarm-clock-plus',
			checkCallback: (checking: boolean) => {
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				const editor = markdownView?.editor ?? null;
				const timeTrackerView = this.getView();
				if (checking) {
					return timeTrackerView !== null && editor !== null;
				}

				if (timeTrackerView !== null && editor !== null) {
					editor.replaceSelection(
						buildPrintValue(this.settings, timeTrackerView.getElapsedTime(), timeTrackerView.containerEl),
					);
					return true;
				}
				return false;
			},
		});

		this.addCommand({
			id: 'start-stop-stopwatch',
			name: 'Start or stop the stopwatch',
			icon: 'alarm-clock',
			checkCallback: (checking: boolean) => {
				const timeTrackerView = this.getView();
				if (checking) {
					return timeTrackerView !== null;
				}

				if (timeTrackerView !== null) {
					timeTrackerView.clickStartStop();
					return true;
				}
				return false;
			},
		});

		this.addCommand({
			id: 'reset-stopwatch',
			name: 'Reset the stopwatch',
			icon: 'alarm-clock-off',
			checkCallback: (checking: boolean) => {
				const timeTrackerView = this.getView();
				if (checking) {
					return timeTrackerView !== null;
				}

				if (timeTrackerView !== null) {
					timeTrackerView.clickReset();
					return true;
				}
				return false;
			},
		});

		this.addSettingTab(new TimetrackerSettingTab(this.app, this));
	}

	onunload() {}

	getView(): TimetrackerView | null {
		const leaf = this.app.workspace.getLeavesOfType(TIMETRACKER_VIEW_TYPE).first();
		if (leaf !== null && leaf !== undefined && leaf.view instanceof TimetrackerView) {
			return leaf.view;
		} else {
			return null;
		}
	}

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
		const timeTrackerView = this.getView();
		timeTrackerView?.clickReload();
	}

	initLeaf(): void {
		if (this.app.workspace.getLeavesOfType(TIMETRACKER_VIEW_TYPE).length > 0) {
			return;
		}
		const rightLeaf = this.app.workspace.getRightLeaf(false);
		if (rightLeaf != null) {
			rightLeaf
				.setViewState({
					type: TIMETRACKER_VIEW_TYPE,
				})
				.then();
		}
	}
}
