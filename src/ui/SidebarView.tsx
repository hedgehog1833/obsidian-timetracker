import { Editor, ItemView, WorkspaceLeaf } from 'obsidian';
import { StopwatchButtons } from './StopwatchButtons';
import ReactDOM from 'react-dom/client';
import React from 'react';

export class SidebarView extends ItemView {
	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
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

	async onOpen() {
		const root = ReactDOM.createRoot(this.containerEl);
		root.render(<StopwatchButtons />);
	}

	async onClose() {
		const root = ReactDOM.createRoot(this.containerEl);
		root.unmount();
	}
}
