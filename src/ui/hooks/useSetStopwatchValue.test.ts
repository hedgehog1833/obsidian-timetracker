import useSetStopwatchValue from './useSetStopwatchValue';

describe('useSetStopwatchValue', () => {
	it('provided setter function is called with given time in milliseconds', () => {
		// given
		const expectedDate = new Date();
		expectedDate.setHours(expectedDate.getHours() - 1, expectedDate.getMinutes() - 2, expectedDate.getSeconds() - 3);
		const expectedTime = expectedDate.getTime();
		const boundaryValue = 1000;
		const lowerBound = expectedTime - boundaryValue;
		const upperBound = expectedTime + boundaryValue;
		const setStopwatchMock = jest.fn();
		const resultFunction = useSetStopwatchValue(setStopwatchMock);

		// when
		resultFunction.doSetStopwatchValue(1, 2, 3);

		// then
		expect(setStopwatchMock).toHaveBeenCalledWith(expect.any(Number));
		expect(setStopwatchMock.mock.calls[0][0]).toBeGreaterThanOrEqual(lowerBound);
		expect(setStopwatchMock.mock.calls[0][0]).toBeLessThanOrEqual(upperBound);
	});
});
