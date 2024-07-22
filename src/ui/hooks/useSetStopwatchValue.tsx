const useSetStopwatchValue = (setStopwatchValue: (milliseconds: number) => void) => {
	const doSetStopwatchValue = (hours: number, minutes: number, seconds: number) => {
		const date = new Date();
		date.setHours(date.getHours() - hours, date.getMinutes() - minutes, date.getSeconds() - seconds);
		setStopwatchValue(date.getTime());
	};

	return { doSetStopwatchValue };
};

export default useSetStopwatchValue;
