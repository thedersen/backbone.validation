var config = exports;

config['Default'] = {
    environment: 'browser',
    sources: [
        'lib/jquery-1.6.2.js',
        'lib/underscore.js',
        'lib/backbone.js',
        'backbone.validation.js'
    ],
    tests: [
        'tests/**/*.js'
    ]
};
