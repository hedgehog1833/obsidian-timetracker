import { ItemView, WorkspaceLeaf } from 'obsidian';
import { StopwatchButtons } from './StopwatchButtons';
import ReactDOM, { Root } from 'react-dom/client';
import React from 'react';
import { StopwatchModel } from '../stopwatch/StopwatchModel';
import EditorStopwatch from '../../main';
import { StopwatchState } from '../stopwatch/StopwatchState';

export class SidebarView extends ItemView {
	private readonly stopwatchModel: StopwatchModel;
	private readonly plugin: EditorStopwatch;
	private root: Root;

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

	start(): StopwatchState {
		return this.stopwatchModel.start();
	}

	stop(): StopwatchState {
		return this.stopwatchModel.stop();
	}

	reset(): StopwatchState {
		return this.stopwatchModel.reset();
	}

	async onOpen() {
		this.root = ReactDOM.createRoot(this.containerEl);
		this.root.render(
			<StopwatchButtons
				plugin={this.plugin}
				reset={() => this.reset()}
				start={() => this.start()}
				stop={() => this.stop()}
				getCurrentStopwatchTime={() => this.getCurrentStopwatchTime()}
			/>,
		);
	}

	async onClose() {
		this.root.unmount();
	}
}
