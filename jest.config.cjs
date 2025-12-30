module.exports = {
	testEnvironment: 'jest-environment-jsdom',
	transform: {
		'^.+\\.[tj]sx?$': ['babel-jest', { configFile: './babel.config.js' }]
	},
	moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
	testMatch: ['<rootDir>/src/tests/**/*.test.{js,jsx}', '<rootDir>/src/**/?(*.)+(spec|test).{js,jsx}'],
	setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
		'\\.(css|less|scss|sass)$': '<rootDir>/src/tests/styleMock.js',
		"\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js",
	},
	transformIgnorePatterns: [
		'node_modules/(?!(axios|uuid)/)',
	],
};
