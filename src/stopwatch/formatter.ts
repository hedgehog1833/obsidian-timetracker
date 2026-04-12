import { DateTime } from 'luxon';

const format = (milliseconds: number, format: string): string => {
	return DateTime.fromMillis(milliseconds).toFormat(format);
};

export default format;
