import { moment } from 'obsidian';

export function format(milliseconds: number, format: string): string {
	return moment.duration(milliseconds).format(format, {
		trim: 'false',
	});
}
