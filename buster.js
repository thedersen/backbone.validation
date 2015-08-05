var config = exports;

config['Browser'] = {
  environment: 'browser',
  sources: [
    'lib/jquery-1.6.2.js',
    'lib/underscore.js',
    'lib/backbone-1.0.0.js',
    'dist/backbone-validation.js',
    'dist/backbone-validation-async.js'
  ],
  tests: [
    'tests/*.js',
    'tests/async/*.js',
    'tests/validators/*.js'
  ],
  testHelpers: ['tests/helper.js']
};

config['Node'] = {
  environment: 'node',
  tests: [
    'tests/node/*.js'
  ]
};