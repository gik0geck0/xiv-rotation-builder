module.exports = {
    testMatch: ['<rootDir>/src/**/__tests__/*.spec.ts', '<rootDir>/src/**/__tests__/*.spec.js'],
    coverageThreshold: {
        global: {
            statements: 95,
            branches: 84,
            functions: 90,
            lines: 95
        }
    },
    moduleNameMapper: {
        '^xiv/(.+)$': '<rootDir>/src/modules/xiv/$1/$1'
    },
    preset: '@lwc/jest-preset',
    moduleFileExtensions: ['js', 'ts'],
    resolver: require.resolve('@lwc/jest-resolver')
};
