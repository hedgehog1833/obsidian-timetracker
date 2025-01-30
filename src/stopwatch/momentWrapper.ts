import { moment } from 'obsidian';

const format = (milliseconds: number, format: string): string => {
	return moment.duration(milliseconds).format(format, {
		trim: 'false',
	});
};

export default format;
