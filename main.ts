import { Editor, MarkdownView, Plugin, WorkspaceLeaf } from 'obsidian';
import { SidebarView } from './src/ui/SidebarView';
import { EditorStopwatchSettingTab } from './src/EditorStopwatchSettingTab';

interface EditorStopwatchSettings {
	interval: number;
	format: string;
}

const DEFAULT_SETTINGS: EditorStopwatchSettings = {
	interval: 100,
	format: 'HH:mm:ss.SSS',
};

export default class EditorStopwatch extends Plugin {
	settings: EditorStopwatchSettings;

	async onload() {
		await this.loadSettings();

		this.registerView('stopwatch-button-sidebar', (leaf: WorkspaceLeaf) => {
			return new SidebarView(leaf, this);
		});

		this.app.workspace.onLayoutReady(this.initLeaf.bind(this));

		this.addCommand({
			id: 'timestamp-insert',
			name: 'Insert timestamp based on current stopwatch',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				const sidebarView = this.getView();
				const currentStopwatchTime = sidebarView?.getCurrentStopwatchTime() || null;
				currentStopwatchTime && editor.replaceSelection(`${currentStopwatchTime}: `);
				return;
			},
		});

		// this.addCommand({
		// 	id: 'stopwatch-start',
		// 	name: 'Start the stopwatch',
		// 	checkCallback: (checking: boolean) => {
		// 		const sidebarView = this.getView();
		//
		// 		console.log('a');
		//
		// 		if (checking) {
		// 			console.log('b');
		// 			return sidebarView !== null;
		// 		}
		//
		// 		if (sidebarView !== null) {
		// 			console.log('c');
		// 			sidebarView.start();
		// 			return true;
		// 		} else {
		// 			return false;
		// 		}
		// 	},
		// });
		//
		// this.addCommand({
		// 	id: 'stopwatch-stop',
		// 	name: 'Stop the stopwatch',
		// 	checkCallback: (checking: boolean) => {
		// 		const sidebarView = this.getView();
		//
		// 		if (checking) {
		// 			return sidebarView !== null;
		// 		}
		//
		// 		if (sidebarView !== null) {
		// 			sidebarView.stop();
		// 			return true;
		// 		} else {
		// 			return false;
		// 		}
		// 	},
		// });
		//
		// this.addCommand({
		// 	id: 'stopwatch-reset',
		// 	name: 'Reset the stopwatch',
		// 	checkCallback: (checking: boolean) => {
		// 		const sidebarView = this.getView();
		//
		// 		if (checking) {
		// 			return sidebarView !== null;
		// 		}
		//
		// 		if (sidebarView !== null) {
		// 			sidebarView.reset();
		// 			return true;
		// 		} else {
		// 			return false;
		// 		}
		// 	},
		// });

		this.addSettingTab(new EditorStopwatchSettingTab(this.app, this));
	}

	onunload() {
		this.app.workspace.getLeavesOfType('stopwatch-button-sidebar').forEach((leaf) => leaf.detach());
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	initLeaf(): void {
		if (this.app.workspace.getLeavesOfType('stopwatch-button-sidebar').length) {
			return;
		}
		this.app.workspace.getRightLeaf(false).setViewState({
			type: 'stopwatch-button-sidebar',
		});
	}

	getView(): SidebarView | null {
		// todo nilsd refactor to not return null
		const leaf = this.app.workspace.getLeavesOfType('stopwatch-button-sidebar').first();
		if (leaf !== null && leaf !== undefined && leaf.view instanceof SidebarView) {
			return leaf.view;
		} else {
			return null;
		}
	}
}
