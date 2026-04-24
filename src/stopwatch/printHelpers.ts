export interface TimeValues {
	hours: string;
	minutes: string;
	seconds: string;
}

export interface TokenPatterns {
	hours: string;
	minutes: string;
	seconds: string;
}

export const replaceTokens = (format: string, values: TimeValues, patterns: TokenPatterns): string => {
	if (!format) return '';

	return format
		.split(patterns.hours)
		.join(values.hours)
		.split(patterns.minutes)
		.join(values.minutes)
		.split(patterns.seconds)
		.join(values.seconds);
};

export default replaceTokens;
