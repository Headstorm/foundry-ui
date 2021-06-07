// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  // All imported modules in your tests should be mocked automatically
  // automock: false,

  // Stop running tests after `n` failures
  // bail: 0,

  // The directory where Jest should store its cached dependency information
  // cacheDirectory: 'C:\\Users\\trumpethouse\\AppData\\Local\\Temp\\jest',

  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
    '!**/__tests__/**',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/index.{ts,js}',
    '!src/**/Examples/**',
    '!src/serviceWorker.ts',
  ],

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // An array of regexp pattern strings used to skip coverage collection
  // coveragePathIgnorePatterns: [
  //   '\\\\node_modules\\\\',
  // ],

  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: [
    'json-summary',
     'html',
  //   'text',
  //   'lcov',
  //   'clover'
  ],

  // An object that configures minimum threshold enforcement for coverage results
  // coverageThreshold: undefined,

  // A path to a custom dependency extractor
  // dependencyExtractor: undefined,

  // Make calling deprecated APIs throw helpful error messages
  // errorOnDeprecated: false,

  // Force coverage collection from ignored files using an array of glob patterns
  // forceCoverageMatch: [],

  // A path to a module which exports an async function that is triggered once before all test suites
  // globalSetup: undefined,

  // A path to a module which exports an async function that is triggered once after all test suites
  // globalTeardown: undefined,

  // A set of global variables that need to be available in all test environments
  // TODO: Get this working - ts-jest x Lerna is a fresh issue we need to solve
  // globals: {
  //   'ts-jest': {
  //     tsConfig: './tsconfig.json'
  //   }
  // },

  // The maximum amount of workers used to run your tests. Can be specified as % or a number. E.g. maxWorkers: 10% will use 10% of your CPU amount + 1 as the maximum worker number. maxWorkers: 2 will use a maximum of 2 workers.
  // maxWorkers: '50%',

  // An array of directory names to be searched recursively up from the requiring module's location
  // moduleDirectories: [
  //   'node_modules'
  // ],

  // An array of file extensions your modules use
  // moduleFileExtensions: [
  //   'js',
  //   'json',
  //   'jsx',
  //   'ts',
  //   'tsx',
  //   'node'
  // ],

  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  // moduleNameMapper: {},

  // An array of regexp pattern strings, matched against all module paths before considered 'visible' to the module loader
  // modulePathIgnorePatterns: [],

  // Activates notifications for test results
  // notify: false,

  // An enum that specifies notification mode. Requires { notify: true }
  // notifyMode: 'failure-change',

  // A preset that is used as a base for Jest's configuration
  // preset: 'ts-jest',

  // Run tests from one or more projects
  // projects: undefined,

  // Use this configuration option to add custom reporters to Jest
  // reporters: undefined,

  // Automatically reset mock state between every test
  // resetMocks: false,

  // Reset the module registry before running each individual test
  // resetModules: false,

  // A path to a custom resolver
  // resolver: undefined,

  // Automatically restore mock state between every test
  // restoreMocks: false,

  // The root directory that Jest should scan for tests and modules within
  // rootDir: undefined,

  // A list of paths to directories that Jest should use to search for files in
  // roots: [
  //   '<rootDir>'
  // ],

  // Allows you to use a custom runner instead of Jest's default test runner
  // runner: 'jest-runner',

  // The paths to modules that run some code to configure or set up the testing environment before each test
  // setupFiles: [],

  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: [
    './src/setupTests.ts'
  ],

  // A list of paths to snapshot serializer modules Jest should use for snapshot testing
  // snapshotSerializers: [],

  // The test environment that will be used for testing
  // TODO: Some part of the create-react-app dependency set doesn't like
  //   the latest version of jest/react-testing-library
  //  See https://stackoverflow.com/questions/61036156/react-typescript-testing-typeerror-mutationobserver-is-not-a-constructor
  //   for entrypoint into the conversation/band-aid fix. We should be able to use
  //   the native jsdom environment once this issue is resolved.
  testEnvironment: 'jest-environment-jsdom-sixteen',

  // Options that will be passed to the testEnvironment
  // testEnvironmentOptions: {},

  // Adds a location field to test results
  // testLocationInResults: false,

  // The glob patterns Jest uses to detect test files
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[tj]s?(x)'
  ],

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  // testPathIgnorePatterns: [
  //   '\\\\node_modules\\\\'
  // ],

  // The regexp pattern or array of patterns that Jest uses to detect test files
  // testRegex: [],

  // This option allows the use of a custom results processor
  // testResultsProcessor: undefined,

  // This option allows use of a custom test runner
  // testRunner: 'jasmine2',

  // This option sets the URL for the jsdom environment. It is reflected in properties such as location.href
  // testURL: 'http://localhost',

  // Setting this value to 'fake' allows the use of fake timers for functions such as 'setTimeout'
  // timers: 'real',

  // A map from regular expressions to paths to transformers
  // transform: undefined,

  // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
  // transformIgnorePatterns: [
  //   '\\\\node_modules\\\\'
  // ],

  // An array of regexp pattern strings that are matched against all modules before the module loader will automatically return a mock for them
  // unmockedModulePathPatterns: undefined,

  // Indicates whether each individual test should be reported during the run
  // verbose: undefined,

  // An array of regexp patterns that are matched against all source file paths before re-running tests in watch mode
  // watchPathIgnorePatterns: [],

  // Whether to use watchman for file crawling
  // watchman: true,
};
