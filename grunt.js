module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '// <%= pkg.title || pkg.name %> v<%= pkg.version %>\n' +
              '//\n' +
              '// Copyright (c) 2011-<%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
              '// Distributed under MIT License\n' +
              '//\n' +
              '// Documentation and full license available at:\n' +
              '// <%= pkg.homepage ? pkg.homepage : "" %>'
    },
    concat: {
      browser: {
        src: ['<banner:meta.banner>', '<file_strip_banner:src/<%= pkg.name %>.js>'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    min: {
      browser: {
        src: ['<banner:meta.banner>', '<config:concat.browser.dest>'],
        dest: 'dist/<%= pkg.name %>-min.js'
      }
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint'
    },
    lint: {
      files: ['grunt.js', 'src/**/*.js', 'tests/**/*.js']
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        node: true
      },
      globals: {
        Backbone: true,
        _: true,
        jQuery: true,
        $: true,
        buster: true,
        assert: true,
        refute: true
      }
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'concat lint min');

};
