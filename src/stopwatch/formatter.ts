import { Duration } from 'luxon';

const format = (milliseconds: number, format: string): string => {
	return Duration.fromMillis(milliseconds).toFormat(format);
};

export default format;
