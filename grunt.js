
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '// <%= pkg.title %> v<%= pkg.version %>\n' +
              '//\n' +
              '// Copyright (c) 2011-<%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
              '// Distributed under MIT License\n' +
              '//\n' +
              '// Documentation and full license available at:\n' +
              '// <%= pkg.homepage %>'
    },
    rig: {
      browser: {
        src: ['<banner:meta.banner>', '<file_strip_banner:src/<%= pkg.name %>.js>'],
        dest: 'dist/<%= pkg.name %>.js'
      },
      amd: {
        src: ['<banner:meta.banner>', '<file_strip_banner:src/<%= pkg.name %>-amd.js>'],
        dest: 'dist/<%= pkg.name %>-amd.js'
      }
    },
    min: {
      browser: {
        src: ['<banner:meta.banner>', '<config:rig.browser.dest>'],
        dest: 'dist/<%= pkg.name %>-min.js'
      },
      amd: {
        src: ['<banner:meta.banner>', '<config:rig.amd.dest>'],
        dest: 'dist/<%= pkg.name %>-amd-min.js'
      }
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'default'
    },
    buster: {
      test: {
        'config': 'buster.js',
        'color': 'none',
        'config-group': 'Browser'
      },
      server: {
        'port': '1111'
      }
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
        refute: true,
        define: true
      }
    },
    uglify: {},
    docco: {
      app: {
        src: ['dist/backbone-validation.js'],
        options: {
          template: 'docco.jst'
        }
      }
    },

    shell: {
      npm: {
        command: 'npm publish',
        stdout: true,
        stderr: true
      },
      clone: {
        command: 'git clone git@github.com:thedersen/thedersen.github.com.git',
        stdout: true,
        stderr: true
      },
      copyDocco: {
        command: 'cp docs/backbone-validation.html thedersen.github.com/projects/backbone-validation/docs/index.html',
        stdout: true,
        stderr: true
      },
      copyCss: {
        command: 'cp docs/docco.css thedersen.github.com/projects/backbone-validation/docs/docco.css',
        stdout: true,
        stderr: true
      },
      copyExamples: {
        command: 'cp -rf examples/ thedersen.github.com/projects/backbone-validation/examples/',
        stdout: true,
        stderr: true
      },
      push: {
        command: 'git commit -am "Updated docs for Backbone.Validation" && git push origin master',
        stdout: true,
        stderr: true,
        execOptions: {
          cwd: 'thedersen.github.com'
        }
      },
      cleanup: {
        command: 'rm -rf thedersen.github.com',
        stdout: true,
        stderr: true
      }
    }
  });

  grunt.registerTask('default', 'rig lint buster min');
  grunt.registerTask('publish', 'docco shell');

  grunt.loadNpmTasks('grunt-buster');
  grunt.loadNpmTasks('grunt-docco');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-rigger');
};
