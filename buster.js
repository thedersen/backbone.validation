var config = exports;

config['Browser'] = {
  environment: 'browser',
  sources: [
    'lib/jquery-1.6.2.js',
    'lib/underscore.js',
    'lib/backbone-0.9.9.js',
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