import { MarkdownView, Plugin, WorkspaceLeaf } from 'obsidian';
import { TimetrackerView } from './ui/TimetrackerView';
import { TimetrackerSettingTab } from './timetrackerSettingTab';
import getFormat from './stopwatch/formatSettings';
import replaceTokens, { TimeValues } from './stopwatch/printHelpers';
import {
	migrateFormat,
	rgbToHex,
	loadFirstTextColor,
	getCurrentTimeValues,
	buildPrintValue,
	applyTextColor,
} from './mainHelpers';

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
	timeTrackerView: TimetrackerView | null = null;

	async onload() {
		await this.loadSettings();

		this.registerView(TIMETRACKER_VIEW_TYPE, (leaf: WorkspaceLeaf) => {
			this.timeTrackerView = new TimetrackerView(leaf, this.settings);
			return this.timeTrackerView;
		});

		this.app.workspace.onLayoutReady(this.initLeaf.bind(this));

		this.addCommand({
			id: 'insert-timestamp',
			name: 'Insert timestamp based on current stopwatch value',
			icon: 'alarm-clock-plus',
			checkCallback: (checking: boolean) => {
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				const editor = markdownView?.editor ?? null;
				if (checking) {
					return this.timeTrackerView !== null && editor !== null;
				}

				if (this.timeTrackerView !== null && editor !== null) {
					const formattedStopwatchTime = this.formatPrintValue(this.timeTrackerView);
					const suffix = this.settings.lineBreakAfterInsert ? '\n' : ('\u200B ' as string);
					editor.replaceSelection(`${formattedStopwatchTime}${suffix}`);
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
				if (checking) {
					return this.timeTrackerView !== null;
				}

				if (this.timeTrackerView !== null) {
					this.timeTrackerView.clickStartStop();
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
				if (checking) {
					return this.timeTrackerView !== null;
				}

				if (this.timeTrackerView !== null) {
					this.timeTrackerView.clickReset();
					return true;
				}
				return false;
			},
		});

		this.addSettingTab(new TimetrackerSettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		const loadedSettings: TimetrackerSettings = await this.loadData();
		const isFormatMigrated = migrateFormat(loadedSettings);
		const isFirstTextColorLoaded = loadFirstTextColor(loadedSettings);
		this.settings = Object.assign({}, DEFAULT_SETTINGS, loadedSettings);
		if (isFormatMigrated || isFirstTextColorLoaded) {
			await this.saveSettings();
		}
	}

	async saveSettings() {
		await this.saveData(this.settings);
		this.timeTrackerView?.clickReload();
	}

	initLeaf(): void {
		if (this.app.workspace.getLeavesOfType(TIMETRACKER_VIEW_TYPE).length > 0) {
			return;
		}
		const rightLeaf = this.app.workspace.getRightLeaf(false);
		if (rightLeaf != null) {
			rightLeaf.setViewState({
				type: TIMETRACKER_VIEW_TYPE,
			});
		}
	}

	formatPrintValue(view: TimetrackerView): string {
		const stopwatchValues = getCurrentTimeValues(view.getElapsedTime(), this.settings.trimLeadingZeros);
		const printValue = buildPrintValue(this.settings, stopwatchValues);
		return applyTextColor(printValue, this.settings.textColor, view.containerEl);
	}
}
