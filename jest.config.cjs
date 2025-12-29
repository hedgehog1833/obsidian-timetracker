module.exports = {
	testEnvironment: 'jsdom',
	transform: { '.(ts|tsx)': 'ts-jest' },
	collectCoverage: false,
	collectCoverageFrom: ['src/**/*.{ts,tsx,js,jsx}', '!src/**/*.test.{ts,tsx,js,jsx}'],
	coverageDirectory: 'coverage',
}
