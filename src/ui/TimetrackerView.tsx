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
}

export class TimetrackerView extends ItemView implements PersistentStopwatchState {
	private readonly stopwatchModel: StopwatchModel;
	private readonly settings: TimetrackerSettings;
	private root: Root;
	startedAt: number;
	offset: number;

	constructor(leaf: WorkspaceLeaf, settings: TimetrackerSettings, isDesktop: boolean) {
		super(leaf);
		this.settings = settings;

		// let startedAt = 0;
		// let offset = 0;

		// if (isDesktop && this.settings.timerValue) {
		// 	startedAt = this.settings.timerValue.startedAt;
		// 	offset = this.settings.timerValue.offset;
		// }

		this.stopwatchModel = new StopwatchModel(0, 0);
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
		this.clickReload();
	}

	start(): StopwatchState {
		return this.stopwatchModel.start();
	}

	stop(): StopwatchState {
		console.log('stopped');
		this.app.workspace.requestSaveLayout();
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
				settings={this.settings}
				reset={() => this.reset()}
				start={() => this.start()}
				stop={() => this.stop()}
				getCurrentStopwatchTime={() => this.format()}
				setCurrentStopwatchTime={(milliseconds: number) => this.setCurrentStopwatchTime(milliseconds)}
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

	async setViewState(state: PersistentStopwatchState, result: ViewStateResult): Promise<void> {
		console.log(`state ${state.startedAt}`);
		if (state.startedAt) {
			this.startedAt = state.startedAt;
		}

		if (state.offset) {
			this.offset = state.offset;
		}

		return super.setState(state, result);
	}

	getViewState(): PersistentStopwatchState {
		console.log(`TEEEEEST ${this.startedAt}`);
		console.log(`TEEEEESTasd ${this.offset}`);
		return {
			startedAt: this.startedAt,
			offset: this.offset,
		};
	}
}
