import { Editor, Plugin, WorkspaceLeaf } from 'obsidian';
import { TimetrackerView } from './ui/TimetrackerView';
import { TimetrackerSettingTab } from './TimetrackerSettingTab';
import { moment } from 'obsidian';
import momentDurationFormatSetup from 'moment-duration-format';
import { StopwatchState } from './stopwatch/StopwatchState';

momentDurationFormatSetup(moment);

export const TIMETRACKER_VIEW_TYPE = 'timetracker-sidebar';

interface TimetrackerSettings {
	interval: number;
	format: string;
	trimLeadingZeros: boolean;
}

const DEFAULT_SETTINGS: TimetrackerSettings = {
	interval: 100,
	format: 'HH:mm:ss.SSS',
	trimLeadingZeros: false,
};

export default class Timetracker extends Plugin {
	settings: TimetrackerSettings;
	statusBarItem: HTMLElement;

	async onload() {
		await this.loadSettings();

		this.registerView(TIMETRACKER_VIEW_TYPE, (leaf: WorkspaceLeaf) => {
			return new TimetrackerView(leaf, this, (state) => this.updateStatusBar(state));
		});

		this.app.workspace.onLayoutReady(this.initLeaf.bind(this));

		this.addCommand({
			id: 'insert-timestamp',
			name: 'Insert timestamp based on current stopwatch value',
			editorCheckCallback: (checking: boolean, editor: Editor) => {
				const sidebarView = this.getView();

				if (checking) {
					return sidebarView !== null;
				}

				if (sidebarView != null) {
					const currentStopwatchTime = sidebarView?.getCurrentStopwatchTime() || null;
					currentStopwatchTime && editor.replaceSelection(`${currentStopwatchTime}: `);
					return true;
				} else {
					return false;
				}
			},
		});

		this.addCommand({
			id: 'start-stop-stopwatch',
			name: 'Start or stop the stopwatch',
			checkCallback: (checking: boolean) => {
				const sidebarView = this.getView();

				if (checking) {
					return sidebarView != null;
				}

				if (sidebarView != null) {
					sidebarView.clickStartStop();
					return true;
				} else {
					return false;
				}
			},
		});

		this.addCommand({
			id: 'reset-stopwatch',
			name: 'Reset the stopwatch',
			checkCallback: (checking: boolean) => {
				const sidebarView = this.getView();

				if (checking) {
					return sidebarView != null;
				}

				if (sidebarView != null) {
					sidebarView.clickReset();
					return true;
				} else {
					return false;
				}
			},
		});

		this.statusBarItem = this.addStatusBarItem();

		this.addSettingTab(new TimetrackerSettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
		const sidebarView = this.getView();
		sidebarView?.clickReload();
	}

	initLeaf(): void {
		if (this.app.workspace.getLeavesOfType(TIMETRACKER_VIEW_TYPE).length) {
			return;
		}
		this.app.workspace.getRightLeaf(false).setViewState({
			type: TIMETRACKER_VIEW_TYPE,
		});
	}

	getView(): TimetrackerView | null {
		const leaf = this.app.workspace.getLeavesOfType(TIMETRACKER_VIEW_TYPE).first();
		if (leaf !== null && leaf !== undefined && leaf.view instanceof TimetrackerView) {
			return leaf.view;
		} else {
			return null;
		}
	}

	updateStatusBar(state: string): void {
		if (this.statusBarItem && state) {
			if (state == StopwatchState.STARTED) {
				this.statusBarItem.setText('Timetracker: \u23F5');
			} else if (state == StopwatchState.STOPPED) {
				this.statusBarItem.setText('Timetracker: \u23F8');
			} else {
				this.statusBarItem.setText('');
			}
		}
	}
}
