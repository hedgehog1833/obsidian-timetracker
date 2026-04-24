import { Duration } from 'luxon';
import { COMPLETE_TIME_FORMAT } from './formatSettings';

const format = (milliseconds: number): string => {
	return Duration.fromMillis(milliseconds).toFormat(COMPLETE_TIME_FORMAT);
};

export default format;
