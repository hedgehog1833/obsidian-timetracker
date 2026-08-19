import { ItemView, ViewStateResult, WorkspaceLeaf } from 'obsidian';
import ReactDOM, { Root } from 'react-dom/client';
import { TIMETRACKER_VIEW_TYPE, TimetrackerSettings } from '../main';
import { PersistentStopwatchState, StopwatchController } from '../stopwatch/stopwatchController';
import { StopwatchArea } from './StopwatchArea';

const VIEW_DISPLAY_TEXT = 'Timetracker';
const VIEW_ICON = 'clock';

export class TimetrackerView extends ItemView {
	private readonly settings: TimetrackerSettings;
	private readonly stopwatchController: StopwatchController;
	private root: Root | null = null;

	constructor(leaf: WorkspaceLeaf, settings: TimetrackerSettings, stopwatchController: StopwatchController) {
		super(leaf);
		this.settings = settings;
		this.stopwatchController = stopwatchController;
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
		return this.stopwatchController.getElapsedTime();
	}

	async onOpen() {
		this.root = ReactDOM.createRoot(this.containerEl);
		this.root.render(<StopwatchArea settings={this.settings} stopwatch={this.stopwatchController} />);
	}

	async onClose() {
		if (this.root != null) {
			this.root.unmount();
			this.root = null;
		}
	}

	async setState(state: PersistentStopwatchState, result: ViewStateResult): Promise<void> {
		this.stopwatchController.restore(state, this.settings.persistTimerValue);
		return super.setState(state, result);
	}

	getState() {
		return this.stopwatchController.getPersistentState(this.settings.persistTimerValue);
	}
}
