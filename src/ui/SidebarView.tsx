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
	// private intervalId: number;

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
		// this.createInterval();
		return this.stopwatchModel.start();
	}

	stop(): StopwatchState {
		// this.clearInterval();
		return this.stopwatchModel.stop();
	}

	// startStop(): StopwatchState {
	// 	if (this.stopwatchModel.getState() != StopwatchState.STARTED) {
	// 		return this.stopwatchModel.start();
	// 	} else {
	// 		return this.stopwatchModel.stop();
	// 	}
	// }

	reset(): StopwatchState {
		// this.clearInterval();
		return this.stopwatchModel.reset();
	}

	// createInterval = () => {
	// 	if (this.intervalId != 0) {
	// 		window.clearInterval(this.intervalId);
	// 	}
	// 	this.intervalId = window.setInterval(() => {}, this.plugin.settings.interval);
	// };
	//
	// clearInterval = () => {
	// 	if (this.intervalId != 0) {
	// 		window.clearInterval(this.intervalId);
	// 		this.intervalId = 0;
	// 	}
	// };

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
