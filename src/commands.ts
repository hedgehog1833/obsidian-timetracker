import { Editor, MarkdownFileInfo, MarkdownView, Plugin } from 'obsidian';
import { TimetrackerSettings } from './main';
import { buildPrintValue } from './printHelpers';
import { StopwatchController } from './stopwatch/stopwatchController';

export type CommandHost = Pick<Plugin, 'addCommand'> & { settings: TimetrackerSettings };

export const registerCommands = (plugin: CommandHost, stopwatch: StopwatchController): void => {
	plugin.addCommand({
		id: 'insert-timestamp',
		name: 'Insert timestamp based on current stopwatch value',
		icon: 'alarm-clock-plus',
		editorCallback: (editor: Editor, context: MarkdownView | MarkdownFileInfo) => {
			const containerEl = context instanceof MarkdownView ? context.containerEl : activeDocument.body;
			editor.replaceSelection(buildPrintValue(plugin.settings, stopwatch.getElapsedTime(), containerEl));
		},
	});

	plugin.addCommand({
		id: 'start-stop-stopwatch',
		name: 'Start or stop the stopwatch',
		icon: 'alarm-clock',
		callback: () => {
			stopwatch.startOrStop();
		},
	});

	plugin.addCommand({
		id: 'reset-stopwatch',
		name: 'Reset the stopwatch',
		icon: 'alarm-clock-off',
		callback: () => {
			stopwatch.reset();
		},
	});
};
