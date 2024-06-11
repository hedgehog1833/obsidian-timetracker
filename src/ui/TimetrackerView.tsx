import { ItemView, WorkspaceLeaf } from 'obsidian';
import { StopwatchArea } from './StopwatchArea';
import ReactDOM, { Root } from 'react-dom/client';
import React from 'react';
import { StopwatchModel } from '../stopwatch/StopwatchModel';
import Timetracker, { TIMETRACKER_VIEW_TYPE } from '../main';
import { StopwatchState } from '../stopwatch/StopwatchState';

export class TimetrackerView extends ItemView {
	private readonly stopwatchModel: StopwatchModel;
	private readonly plugin: Timetracker;
	private root: Root;

	constructor(leaf: WorkspaceLeaf, plugin: Timetracker) {
		super(leaf);
		this.plugin = plugin;
		this.stopwatchModel = new StopwatchModel(plugin);
	}

	getDisplayText(): string {
		return 'Timetracker sidebar';
	}

	getViewType(): string {
		return TIMETRACKER_VIEW_TYPE;
	}

	getIcon(): string {
		return 'clock';
	}

	getCurrentStopwatchTime(complete?: boolean): string {
		return this.stopwatchModel.getCurrentValue(complete);
	}

	setCurrentStopwatchTime(milliseconds: number): void {
		this.clickReset();
		this.stopwatchModel.setCurrentValue(milliseconds);
		this.clickReload();
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

	clickReload(): void {
		const el = this.containerEl.querySelector('button.reload-button');
		(el as HTMLButtonElement).click();
	}

	async onOpen() {
		this.root = ReactDOM.createRoot(this.containerEl);
		this.root.render(
			<StopwatchArea
				plugin={this.plugin}
				reset={() => this.reset()}
				start={() => this.start()}
				stop={() => this.stop()}
				getCurrentStopwatchTime={() => this.getCurrentStopwatchTime(true)}
				setCurrentStopwatchTime={(milliseconds: number) => this.setCurrentStopwatchTime(milliseconds)}
			/>,
		);
	}

	async onClose() {
		if (this.root !== null && this.root !== undefined) {
			this.root.unmount();
		}
	}
}
