import { ItemView, WorkspaceLeaf } from 'obsidian';
import { StopwatchButtons } from './StopwatchButtons';
import ReactDOM from 'react-dom/client';
import React from 'react';
import { StopwatchModel } from '../stopwatch/StopwatchModel';

export class SidebarView extends ItemView {
	private readonly stopwatchModel: StopwatchModel;

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
		this.stopwatchModel = new StopwatchModel();
	}

	getDisplayText(): string {
		console.log(this.leaf.view.app.workspace.activeEditor != null); // this is it fuck yes xD so bekomm ich den editor; lol ne brauch so nicht und klappt nicht
		return 'Stopwatch button sidebar';
	}

	getViewType(): string {
		return 'stopwatch-button-sidebar';
	}

	getIcon(): string {
		return 'clock';
	}

	getCurrentStopwatchTime(): string {
		return this.stopwatchModel.getCurrentValue();
	}

	async onOpen() {
		const root = ReactDOM.createRoot(this.containerEl);
		root.render(<StopwatchButtons model={this.stopwatchModel} />);
	}

	async onClose() {
		const root = ReactDOM.createRoot(this.containerEl);
		root.unmount();
	}
}
