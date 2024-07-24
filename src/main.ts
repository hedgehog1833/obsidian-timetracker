import { Editor, Plugin, WorkspaceLeaf } from 'obsidian';
import { TimetrackerView } from './ui/TimetrackerView';
import { TimetrackerSettingTab } from './TimetrackerSettingTab';
import { moment } from 'obsidian';
import momentDurationFormatSetup from 'moment-duration-format';

momentDurationFormatSetup(moment);

export const TIMETRACKER_VIEW_TYPE = 'timetracker-sidebar';

export interface TimetrackerSettings {
	/** @deprecated custom formats are no longer supported, switches used instead */
	format: string | null;
	/** @deprecated customizing the refresh interval is no longer supported, defaults to 1 second */
	interval: number | null;
	showHours: boolean;
	showMinutes: boolean;
	showSeconds: boolean;
	trimLeadingZeros: boolean;
	lineBreakAfterInsert: boolean;
	textColor: string;
}

const DEFAULT_SETTINGS: TimetrackerSettings = {
	format: null,
	interval: null,
	showHours: true,
	showMinutes: true,
	showSeconds: true,
	trimLeadingZeros: false,
	lineBreakAfterInsert: false,
	textColor: '',
};

export default class Timetracker extends Plugin {
	settings: TimetrackerSettings;

	async onload() {
		await this.loadSettings();

		this.registerView(TIMETRACKER_VIEW_TYPE, (leaf: WorkspaceLeaf) => {
			return new TimetrackerView(leaf, this.settings);
		});

		this.app.workspace.onLayoutReady(this.initLeaf.bind(this));

		this.addCommand({
			id: 'insert-timestamp',
			name: 'Insert timestamp based on current stopwatch value',
			editorCheckCallback: (checking: boolean, editor: Editor) => {
				const sidebarView = this.getView();

				if (checking) {
					return sidebarView !== null;
				}

				if (sidebarView != null) {
					const currentStopwatchTime = sidebarView?.getCurrentStopwatchTime() || null;
					if (currentStopwatchTime) {
						const style = window.getComputedStyle(sidebarView.containerEl);
						const formattedStopwatchTime =
							this.settings.textColor !== this.rgbToHex(style.color)
								? `<span style="color:${this.settings.textColor};">${currentStopwatchTime}</span>`
								: currentStopwatchTime;
						const suffix = this.settings.lineBreakAfterInsert ? '\n' : ('\u200B ' as string);
						editor.replaceSelection(`${formattedStopwatchTime}${suffix}`);
					}
					return true;
				} else {
					return false;
				}
			},
		});

		this.addCommand({
			id: 'start-stop-stopwatch',
			name: 'Start or stop the stopwatch',
			checkCallback: (checking: boolean) => {
				const sidebarView = this.getView();

				if (checking) {
					return sidebarView != null;
				}

				if (sidebarView != null) {
					sidebarView.clickStartStop();
					return true;
				} else {
					return false;
				}
			},
		});

		this.addCommand({
			id: 'reset-stopwatch',
			name: 'Reset the stopwatch',
			checkCallback: (checking: boolean) => {
				const sidebarView = this.getView();

				if (checking) {
					return sidebarView != null;
				}

				if (sidebarView != null) {
					sidebarView.clickReset();
					return true;
				} else {
					return false;
				}
			},
		});

		this.addSettingTab(new TimetrackerSettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		const data: TimetrackerSettings = await this.loadData();
		if (data?.format) {
			data.showHours = data.format.contains('H') || data.format.contains('h');
			data.showMinutes = data.format.contains('M') || data.format.contains('m');
			data.showSeconds = data.format.contains('S') || data.format.contains('s');
		}
		let doSave = false;
		if (data?.textColor?.length == 0) {
			const sidebarView = this.getView();
			if (sidebarView) {
				const style = window.getComputedStyle(sidebarView.containerEl);
				data.textColor = style.color;
			} else {
				data.textColor = '#dadada';
			}
			doSave = true;
		}
		this.settings = Object.assign({}, DEFAULT_SETTINGS, data);
		if (this.settings.format) {
			this.settings.format = null;
			this.settings.interval = null;
			doSave = true;
		}
		doSave && (await this.saveSettings());
	}

	async saveSettings() {
		await this.saveData(this.settings);
		this.getView()?.clickReload();
	}

	initLeaf(): void {
		if (this.app.workspace.getLeavesOfType(TIMETRACKER_VIEW_TYPE).length) {
			return;
		}
		const rightLeaf = this.app.workspace.getRightLeaf(false);
		if (rightLeaf) {
			rightLeaf.setViewState({
				type: TIMETRACKER_VIEW_TYPE,
			});
		}
	}

	getView(): TimetrackerView | null {
		const leaf = this.app.workspace.getLeavesOfType(TIMETRACKER_VIEW_TYPE).first();
		if (leaf !== null && leaf !== undefined && leaf.view instanceof TimetrackerView) {
			return leaf.view;
		} else {
			return null;
		}
	}

	rgbToHex(rgbColor: string): string {
		const rgbValues = rgbColor.slice(4, -1);
		const [r, g, b] = rgbValues.split(',').map((value) => parseInt(value));
		const componentToHex = (c: number) => {
			const hex = c.toString(16);
			return hex.length === 1 ? '0' + hex : hex;
		};
		return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
	}
}
