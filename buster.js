var config = exports;

config['Browser'] = {
  environment: 'browser',
  sources: [
    'lib/jquery-1.8.3.js',
    'lib/underscore.js',
    'lib/backbone-1.0.0.js',
    'dist/backbone-validation.js'
  ],
  tests: [
    'tests/*.js',
    'tests/validators/*.js'
  ]
};

config['Node'] = {
  environment: 'node',
  tests: [
    'tests/node/*.js'
  ]
};