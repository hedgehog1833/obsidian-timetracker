import { App, Editor, MarkdownView, Modal, Notice, Plugin, WorkspaceLeaf } from 'obsidian';
import { SidebarView } from './src/ui/SidebarView';

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

		// This adds a settings tab so the user can configure various aspects of the plugin
		// this.addSettingTab(new EditorStopwatchSettingTab(this.app, this)); // todo nilsd activate?
	}

	onunload() {}

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

// class EditorStopwatchSettingTab extends PluginSettingTab {
// 	plugin: EditorStopwatch;
//
// 	constructor(app: App, plugin: EditorStopwatch) {
// 		super(app, plugin);
// 		this.plugin = plugin;
// 	}
//
// 	display(): void {
// 		const { containerEl } = this;
//
// 		containerEl.empty();
//
// 		new Setting(containerEl)
// 			.setName("Setting #1")
// 			.setDesc("It's a secret")
// 			.addText((text) =>
// 				text
// 					.setPlaceholder("Enter your secret")
// 					.setValue(this.plugin.settings.mySetting)
// 					.onChange(async (value) => {
// 						this.plugin.settings.mySetting = value;
// 						await this.plugin.saveSettings();
// 					})
// 			);
// 	}
// }
