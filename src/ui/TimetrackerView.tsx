import { ItemView, WorkspaceLeaf } from 'obsidian';
import { StopwatchArea } from './StopwatchArea';
import ReactDOM, { Root } from 'react-dom/client';
import React from 'react';
import { StopwatchModel } from '../stopwatch/stopwatchModel';
import { TIMETRACKER_VIEW_TYPE, TimetrackerSettings } from '../main';
import { StopwatchState } from '../stopwatch/stopwatchState';
import getFormat from '../stopwatch/formatSettings';

const VIEW_DISPLAY_TEXT = 'Timetracker sidebar';
const VIEW_ICON = 'clock';

export class TimetrackerView extends ItemView {
	private readonly stopwatchModel: StopwatchModel;
	private readonly settings: TimetrackerSettings;
	private root: Root;

	constructor(leaf: WorkspaceLeaf, settings: TimetrackerSettings) {
		super(leaf);
		this.settings = settings;
		this.stopwatchModel = new StopwatchModel(getFormat(this.settings));
	}

	getDisplayText(): string {
		return VIEW_DISPLAY_TEXT;
	}

	getViewType(): string {
		return TIMETRACKER_VIEW_TYPE;
	}

	getIcon(): string {
		return VIEW_ICON;
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

	setFormatInStopwatch(): void {
		this.stopwatchModel.setCurrentFormat(getFormat(this.settings));
	}

	async onOpen() {
		this.root = ReactDOM.createRoot(this.containerEl);
		this.root.render(
			<StopwatchArea
				settings={this.settings}
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
