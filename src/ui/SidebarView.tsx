import { ItemView, WorkspaceLeaf } from 'obsidian';
import { StopwatchButtons } from './StopwatchButtons';
import ReactDOM from 'react-dom/client';
import React from 'react';
import { StopwatchModel } from '../stopwatch/StopwatchModel';
import EditorStopwatch from '../../main';

export class SidebarView extends ItemView {
	private readonly stopwatchModel: StopwatchModel;
	private readonly plugin: EditorStopwatch;

	constructor(leaf: WorkspaceLeaf, plugin: EditorStopwatch) {
		super(leaf);
		this.plugin = plugin;
		this.stopwatchModel = new StopwatchModel();
	}

	getDisplayText(): string {
		return 'Stopwatch button sidebar';
	}

	getViewType(): string {
		return 'stopwatch-button-sidebar';
	}

	getIcon(): string {
		return 'clock';
	}

	getCurrentStopwatchTime(): string {
		return this.stopwatchModel.getCurrentValue(this.plugin.settings.format);
	}

	async onOpen() {
		const root = ReactDOM.createRoot(this.containerEl);
		root.render(<StopwatchButtons model={this.stopwatchModel} plugin={this.plugin} />);
	}

	async onClose() {
		const root = ReactDOM.createRoot(this.containerEl);
		root.unmount();
	}
}
