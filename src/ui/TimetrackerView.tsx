import { ItemView, WorkspaceLeaf } from 'obsidian';
import { StopwatchButtons } from './StopwatchButtons';
import ReactDOM, { Root } from 'react-dom/client';
import React from 'react';
import { StopwatchModel } from '../stopwatch/StopwatchModel';
import Timetracker from '../../main';
import { StopwatchState } from '../stopwatch/StopwatchState';

export class TimetrackerView extends ItemView {
	private readonly stopwatchModel: StopwatchModel;
	private readonly plugin: Timetracker;
	private root: Root;

	constructor(leaf: WorkspaceLeaf, plugin: Timetracker) {
		super(leaf);
		this.plugin = plugin;
		this.stopwatchModel = new StopwatchModel();
	}

	getDisplayText(): string {
		return 'Timetracker sidebar';
	}

	getViewType(): string {
		return 'timetracker-sidebar';
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

	clickStartStop(): void {
		const el = this.containerEl.querySelector('button.start-stop-button');
		(el as HTMLButtonElement).click();
	}

	clickReset(): void {
		const el = this.containerEl.querySelector('button.reset-button');
		(el as HTMLButtonElement).click();
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
		if (this.root !== null && this.root !== undefined) {
			this.root.unmount();
		}
	}
}
