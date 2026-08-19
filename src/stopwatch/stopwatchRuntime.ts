import { Plugin } from 'obsidian';
import { StopwatchController } from './stopwatchController';

export const STOPWATCH_INTERVAL_MILLISECONDS = 1000;
export const SAVE_WORKSPACE_INTERVAL_MILLISECONDS = 60000;

export interface StopwatchRuntimeOptions {
	requestSaveLayout: () => void;
	isPersistenceEnabled: () => boolean;
}

export const registerStopwatchRuntime = (
	plugin: Plugin,
	stopwatch: StopwatchController,
	options: StopwatchRuntimeOptions,
): void => {
	let lastLayoutSaveAt = 0;

	const requestLayoutSave = (): void => {
		if (!options.isPersistenceEnabled()) {
			return;
		}

		const now = Date.now();
		if (!stopwatch.isRunning() || now - lastLayoutSaveAt >= SAVE_WORKSPACE_INTERVAL_MILLISECONDS) {
			lastLayoutSaveAt = now;
			options.requestSaveLayout();
		}
	};

	plugin.register(stopwatch.subscribe(requestLayoutSave));
	plugin.registerInterval(
		window.setInterval(() => {
			if (stopwatch.isRunning()) {
				stopwatch.notify();
			}
		}, STOPWATCH_INTERVAL_MILLISECONDS),
	);
};
