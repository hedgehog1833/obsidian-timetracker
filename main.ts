import { App, Editor, MarkdownView, Modal, Notice, Plugin, WorkspaceLeaf } from 'obsidian';
import { SidebarView } from './src/ui/SidebarView';

interface EditorStopwatchSettings {
	interval: number;
	format: string;
}

const DEFAULT_SETTINGS: EditorStopwatchSettings = {
	interval: 100,
	format: 'hh:mm:ss.SSS',
};

export default class EditorStopwatch extends Plugin {
	settings: EditorStopwatchSettings;

	async onload() {
		await this.loadSettings();

		this.registerView('stopwatch-button-sidebar', (leaf: WorkspaceLeaf) => {
			return new SidebarView(leaf);
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

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is a notice!');
			this.app.workspace.activeEditor?.editor?.replaceSelection('someText');
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new SampleModal(this.app).open();
			},
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			},
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			},
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		// this.addSettingTab(new EditorStopwatchSettingTab(this.app, this)); // todo nilsd activate?

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
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

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
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
