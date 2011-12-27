var config = exports;

config['Default'] = {
    environment: 'browser',
    sources: [
		'lib/jquery-1.6.2.js', 
		'lib/underscore.js', 
		'lib/backbone.js', 
		'lib/backbone.modelbinding.js', 
		'tests/support/default.js',
		'backbone.validation.min.js'
	],
    tests: [
		'tests/**/*.js'
	]
};

// config['NoConflict'] = {
//     environment: 'browser',
//     sources: [
//      'lib/jquery-1.6.2.js', 
//      'lib/underscore.js', 
//      'lib/backbone.js', 
//      'lib/backbone.modelbinding.js', 
//      'tests/support/noConflict.js', 
//      'backbone.validation.js'
//  ],
//     tests: [
//      'tests/*.js'
//  ]
// };