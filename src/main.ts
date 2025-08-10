import { Editor, EventRef, moment, Plugin, WorkspaceLeaf } from 'obsidian';
import { TimetrackerView } from './ui/TimetrackerView';
import { TimetrackerSettingTab } from './timetrackerSettingTab';
import momentDurationFormatSetup from 'moment-duration-format';
import format from './stopwatch/momentWrapper';
import getFormat, { COMPLETE_TIME_FORMAT } from './stopwatch/formatSettings';

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
	printFormat: string;
	timerValue: PersistentTimerValue | null;
}

interface PersistentTimerValue {
	startedAt: number;
	offset: number;
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
	printFormat: '',
	timerValue: null,
};

export default class Timetracker extends Plugin {
	settings: TimetrackerSettings;
	quitListener: EventRef;

	async onload() {
		await this.loadSettings();

		this.registerView(TIMETRACKER_VIEW_TYPE, (leaf: WorkspaceLeaf) => {
			return new TimetrackerView(leaf, this.settings);
		});

		this.app.workspace.onLayoutReady(this.initLeaf.bind(this));

		this.addCommand({
			id: 'insert-timestamp',
			name: 'Insert timestamp based on current stopwatch value',
			icon: 'alarm-clock-plus',
			editorCheckCallback: (checking: boolean, editor: Editor) => {
				const sidebarView = this.getView();

				if (checking) {
					return sidebarView !== null;
				}

				if (sidebarView != null) {
					const formattedStopwatchTime = this.formatPrintValue(sidebarView);
					const suffix = this.settings.lineBreakAfterInsert ? '\n' : ('\u200B ' as string);
					editor.replaceSelection(`${formattedStopwatchTime}${suffix}`);
					return true;
				} else {
					return false;
				}
			},
		});

		this.addCommand({
			id: 'start-stop-stopwatch',
			name: 'Start or stop the stopwatch',
			icon: 'alarm-clock',
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
			icon: 'alarm-clock-off',
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

		this.quitListener = this.app.workspace.on('quit', () => {
			const sidebarView = this.getView();

			if (sidebarView) {
				const stopwatchModelValues = sidebarView.getCurrentStopwatchModelValues();
				this.settings.timerValue = {
					startedAt: stopwatchModelValues.startedAt,
					offset: stopwatchModelValues.offset,
				};
				this.saveSettings();
			}
		});
	}

	onunload() {
		this.app.metadataCache.offref(this.quitListener);
	}

	async loadSettings() {
		const loadedSettings: TimetrackerSettings = await this.loadData();
		const isFormatMigrated: boolean = this.migrateFormat(loadedSettings);
		const isFirstTextColorLoaded: boolean = this.loadFirstTextColor(loadedSettings);
		this.settings = Object.assign({}, DEFAULT_SETTINGS, loadedSettings);
		(isFormatMigrated || isFirstTextColorLoaded) && (await this.saveSettings());
	}

	async saveSettings() {
		await this.saveData(this.settings);
		const view = this.getView();
		view?.setFormatInStopwatch();
		view?.clickReload();
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

	migrateFormat(settings: TimetrackerSettings | null): boolean {
		if (settings?.format) {
			settings.showHours = settings.format.contains('H') || settings.format.contains('h');
			settings.showMinutes = settings.format.contains('M') || settings.format.contains('m');
			settings.showSeconds = settings.format.contains('S') || settings.format.contains('s');
			settings.format = null;
			settings.interval = null;
			return true;
		}
		return false;
	}

	loadFirstTextColor(settings: TimetrackerSettings | null): boolean {
		if (settings?.textColor?.length == 0) {
			const sidebarView = this.getView();
			if (sidebarView) {
				const style = window.getComputedStyle(sidebarView.containerEl);
				settings.textColor = style.color;
			} else {
				settings.textColor = '#dadada';
			}
			return true;
		}
		return false;
	}

	rgbToHex(rgbColor: string): string {
		if (rgbColor) {
			const rgbValues = rgbColor.slice(4, -1);
			const [r, g, b] = rgbValues.split(',').map((value) => parseInt(value));
			const componentToHex = (c: number) => {
				const hex = c.toString(16);
				return hex.length === 1 ? '0' + hex : hex;
			};
			return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
		}
		return '#dadada';
	}

	formatPrintValue(view: TimetrackerView): string {
		let printValue: string;
		if (this.settings.printFormat.length > 0) {
			const stopwatchValues = this.getCurrentTimeValues(view.getElapsedTime());
			printValue = this.settings.printFormat
				.replace('${hours}', stopwatchValues.hours)
				.replace('${minutes}', stopwatchValues.minutes)
				.replace('${seconds}', stopwatchValues.seconds);
		} else {
			printValue = format(view.getElapsedTime(), getFormat(this.settings));
		}
		const textColor = window.getComputedStyle(view.containerEl)?.color;
		return this.settings.textColor !== this.rgbToHex(textColor)
			? `<span style="color:${this.settings.textColor};">${printValue}</span>`
			: printValue;
	}

	getCurrentTimeValues(elapsedTime: number): { hours: string; minutes: string; seconds: string } {
		const stopwatchValues = format(elapsedTime, COMPLETE_TIME_FORMAT).split(':');
		const [hours, minutes, seconds] = stopwatchValues.map((value) =>
			this.settings.trimLeadingZeros ? parseInt(value).toString() : value,
		);
		return { hours: hours, minutes: minutes, seconds: seconds };
	}
}
