var config = exports;

config['Shared'] = {
  environment: 'browser',
  sources: [
    'lib/jquery-1.6.2.js',
    'lib/underscore.js',
    'lib/backbone-0.9.2.js'
  ],
  tests: [
    'tests/**/*.js'
  ]
};

config['Development'] = {
  extends: 'Shared',
  sources: [
    'dist/backbone-validation.js'
  ]
};

config['Minified'] = {
  extends: 'Shared',
  sources: [
    'dist/backbone-validation-min.js'
  ]
};