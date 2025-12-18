import { ItemView, ViewStateResult, WorkspaceLeaf } from 'obsidian';
import { StopwatchArea } from './StopwatchArea';
import ReactDOM, { Root } from 'react-dom/client';
import { StopwatchModel } from '../stopwatch/stopwatchModel';
import { TIMETRACKER_VIEW_TYPE, TimetrackerSettings } from '../main';
import { StopwatchState } from '../stopwatch/stopwatchState';
import format from '../stopwatch/momentWrapper';
import { COMPLETE_TIME_FORMAT } from '../stopwatch/formatSettings';

const VIEW_DISPLAY_TEXT = 'Timetracker sidebar';
const VIEW_ICON = 'clock';

interface PersistentStopwatchState {
	startedAt: number;
	offset: number;
	state: StopwatchState;
	persistedOffset: number;
}

export class TimetrackerView extends ItemView implements PersistentStopwatchState {
	private readonly settings: TimetrackerSettings;
	private root: Root;
	private stopwatchModel: StopwatchModel;
	startedAt: number;
	offset: number;
	state: StopwatchState;
	persistedOffset: number;

	constructor(leaf: WorkspaceLeaf, settings: TimetrackerSettings) {
		super(leaf);
		this.settings = settings;

		this.stopwatchModel = new StopwatchModel(0, 0, StopwatchState.INITIALIZED);
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

	getElapsedTime(): number {
		return this.stopwatchModel.getElapsedTime();
	}

	getCurrentStopwatchModelValues(): { startedAt: number; offset: number } {
		return {
			startedAt: this.stopwatchModel.getStartedAt(),
			offset: this.stopwatchModel.getPausedAtOffset(),
		};
	}

	setCurrentStopwatchTime(milliseconds: number): void {
		this.clickReset();
		this.stopwatchModel.setCurrentValue(milliseconds);
		if (this.settings.persistTimerValue) {
			this.app.workspace.requestSaveLayout();
		}
		this.clickReload();
	}

	start(): StopwatchState {
		const state = this.stopwatchModel.start();
		return state;
	}

	stop(): StopwatchState {
		const state = this.stopwatchModel.stop();
		if (this.settings.persistTimerValue) {
			this.app.workspace.requestSaveLayout();
		}
		return state;
	}

	reset(): StopwatchState {
		const state = this.stopwatchModel.reset();
		if (this.settings.persistTimerValue) {
			this.app.workspace.requestSaveLayout();
		}
		return state;
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
				settings={this.settings}
				reset={() => this.reset()}
				start={() => this.start()}
				stop={() => this.stop()}
				getCurrentStopwatchTime={() => this.format()}
				setCurrentStopwatchTime={(milliseconds: number) => this.setCurrentStopwatchTime(milliseconds)}
				saveWorkspace={() => this.app.workspace.requestSaveLayout()}
			/>,
		);
	}

	async onClose() {
		if (this.root !== null && this.root !== undefined) {
			this.root.unmount();
		}
	}

	format(): string {
		return format(this.stopwatchModel.getElapsedTime(), COMPLETE_TIME_FORMAT);
	}

	async setState(state: PersistentStopwatchState, result: ViewStateResult): Promise<void> {
		if (state.startedAt && state.state) {
			let adjustedState = state.state;
			if (state.state == StopwatchState.STARTED) {
				adjustedState = StopwatchState.STOPPED;
			}
			this.stopwatchModel = new StopwatchModel(
				state.startedAt,
				this.settings.persistTimerValue && state.persistedOffset ? state.persistedOffset : state.offset,
				adjustedState,
			);
			this.persistedOffset = 0;
		}

		return super.setState(state, result);
	}

	getState() {
		return {
			startedAt: this.stopwatchModel.getStartedAt(),
			offset: this.stopwatchModel.getPausedAtOffset(),
			state: this.stopwatchModel.getState(),
			persistedOffset:
				this.settings.persistTimerValue && this.stopwatchModel.getState() == StopwatchState.STARTED
					? this.stopwatchModel.calculateOffset()
					: 0,
		};
	}
}
