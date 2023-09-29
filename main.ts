import { Editor, MarkdownView, Plugin, WorkspaceLeaf } from 'obsidian';
import { TimetrackerView } from './src/ui/TimetrackerView';
import { TimetrackerSettingTab } from './src/TimetrackerSettingTab';

interface TimetrackerSettings {
	interval: number;
	format: string;
}

const DEFAULT_SETTINGS: TimetrackerSettings = {
	interval: 100,
	format: 'HH:mm:ss.SSS',
};

export default class Timetracker extends Plugin {
	settings: TimetrackerSettings;

	async onload() {
		await this.loadSettings();

		this.registerView('timetracker-sidebar', (leaf: WorkspaceLeaf) => {
			return new TimetrackerView(leaf, this);
		});

		this.app.workspace.onLayoutReady(this.initLeaf.bind(this));

		this.addCommand({
			id: 'insert-timestamp',
			name: 'Insert timestamp based on current stopwatch value',
			editorCallback: (editor: Editor) => {
				const sidebarView = this.getView();
				const currentStopwatchTime = sidebarView?.getCurrentStopwatchTime() || null;
				currentStopwatchTime && editor.replaceSelection(`${currentStopwatchTime}: `);
				return;
			},
		});

		this.addCommand({
			id: 'start--stop-stopwatch',
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

		this.addSettingTab(new TimetrackerSettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	initLeaf(): void {
		if (this.app.workspace.getLeavesOfType('timetracker-sidebar').length) {
			return;
		}
		this.app.workspace.getRightLeaf(false).setViewState({
			type: 'timetracker-sidebar',
		});
	}

	getView(): TimetrackerView | null {
		const leaf = this.app.workspace.getLeavesOfType('timetracker-sidebar').first();
		if (leaf !== null && leaf !== undefined && leaf.view instanceof TimetrackerView) {
			return leaf.view;
		} else {
			return null;
		}
	}
}
