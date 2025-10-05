module.exports = {
	testEnvironment: 'node',
	roots: ['<rootDir>/src', '<rootDir>/tests'],
	setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
	testMatch: ['**/?(*.)+(spec|test).[jt]s'],
	collectCoverageFrom: ['src/**/*.js', '!src/index.js', '!src/server.js'],
};


