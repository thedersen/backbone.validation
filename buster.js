var config = exports;

var versions = ['0.5.3', '0.9.1'];
for (var i = 0; i < versions.length; i++) {
    var ver = versions[i];

    config['Default' + ver] = {
        environment: 'browser',
        sources: [
            'lib/jquery-1.6.2.js',
            'lib/underscore.js',
            'lib/backbone-' + ver + '.js',
            'backbone.validation.js'
        ],
        tests: [
            'tests/**/*.js'
        ]
    };
}
