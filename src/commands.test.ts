import { Command, MarkdownView } from 'obsidian';
import { CommandHost, registerCommands } from './commands';
import { TimetrackerSettings } from './main';
import { StopwatchController } from './stopwatch/stopwatchController';
import { StopwatchState } from './stopwatch/stopwatchState';

describe('registerCommands', () => {
	let stopwatch: StopwatchController;
	let commands: Record<string, Command>;
	let settings: TimetrackerSettings;

	const commandHost = (): CommandHost =>
		({
			settings,
			addCommand: (command: Command) => {
				commands[command.id] = command;
				return command;
			},
		}) as unknown as CommandHost;

	beforeEach(() => {
		settings = {
			trimLeadingZeros: false,
			showHours: true,
			showMinutes: true,
			showSeconds: true,
			lineBreakAfterInsert: false,
			textColor: '',
			printFormat: '',
			persistTimerValue: false,
		} as TimetrackerSettings;

		commands = {};
		stopwatch = new StopwatchController();
		registerCommands(commandHost(), stopwatch);
	});

	it('should register all three commands under their existing ids', () => {
		// then
		expect(Object.keys(commands).sort()).toEqual(['insert-timestamp', 'reset-stopwatch', 'start-stop-stopwatch']);
	});

	it('should not gate any command on a view being present', () => {
		// then
		Object.values(commands).forEach((command) => {
			expect(command.checkCallback).toBeUndefined();
		});
	});

	it('should offer the insert command only while an editor has focus', () => {
		// then
		expect(commands['insert-timestamp'].editorCallback).toBeDefined();
		expect(commands['insert-timestamp'].callback).toBeUndefined();
	});

	it('should start and stop the stopwatch without a view', () => {
		// when
		commands['start-stop-stopwatch'].callback?.();

		// then
		expect(stopwatch.getState()).toBe(StopwatchState.STARTED);

		// when
		commands['start-stop-stopwatch'].callback?.();

		// then
		expect(stopwatch.getState()).toBe(StopwatchState.STOPPED);
	});

	it('should reset the stopwatch without a view', () => {
		// given
		stopwatch.start();

		// when
		commands['reset-stopwatch'].callback?.();

		// then
		expect(stopwatch.getState()).toBe(StopwatchState.INITIALIZED);
	});

	it('should insert the current stopwatch value into the editor', () => {
		// given
		const replaceSelection = jest.fn();
		const context = new MarkdownView({} as never);
		context.containerEl.style.color = 'rgb(1, 2, 3)';
		document.body.appendChild(context.containerEl);
		settings.textColor = '#010203';

		// when
		commands['insert-timestamp'].editorCallback?.({ replaceSelection } as never, context as never);

		// then
		expect(replaceSelection).toHaveBeenCalledTimes(1);
		expect(replaceSelection.mock.calls[0][0]).toContain('00:00:00');
	});
});
